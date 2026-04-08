#!/usr/bin/env node
/**
 * Import sample SMS templates into the database
 * 
 * Note: Templates are automatically imported on application startup (unless AUTO_IMPORT_TEMPLATES=false)
 * This script can be used for manual imports or re-imports.
 * 
 * Usage:
 *   node import-templates.js
 * 
 * Or via API:
 *   node import-templates.js --api --url http://localhost:3000 --api-key YOUR_API_KEY --tenant YOUR_TENANT_ID
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const useApi = args.includes('--api');
const apiUrl = args[args.indexOf('--url') + 1] || 'http://localhost:3000';
const apiKey = args[args.indexOf('--api-key') + 1] || process.env.API_KEY;
const tenantId = args[args.indexOf('--tenant') + 1] || process.env.DEFAULT_TENANT_ID || 'default';

async function importViaDatabase() {
  console.log('📦 Importing templates directly to database...\n');
  
  // Connect to MongoDB
  const mongoose = require('mongoose');
  const config = require('./src/config');
  const SmsTemplate = require('./src/models/SmsTemplate');

  await mongoose.connect(config.db.uri);
  console.log('✅ Connected to MongoDB\n');

  // Load templates
  const templatesPath = path.join(__dirname, 'sample-templates.json');
  const templates = JSON.parse(fs.readFileSync(templatesPath, 'utf-8'));

  let imported = 0;
  let skipped = 0;

  for (const template of templates) {
    try {
      // Add tenant ID
      template.tenantId = tenantId;
      
      // Auto-generate template code from name if not present
      if (!template.code) {
        template.code = template.name
          .toUpperCase()
          .replace(/[^A-Z0-9]+/g, '_')
          .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
      }
      
      // Check if template already exists by code or name
      const existing = await SmsTemplate.findOne({ 
        $or: [
          { code: template.code, tenantId },
          { name: template.name, tenantId }
        ]
      });
      
      if (existing) {
        console.log(`⏭️  Skipped: "${template.name}" (already exists)`);
        skipped++;
        continue;
      }

      await SmsTemplate.create(template);
      console.log(`✅ Imported: "${template.name}"`);
      imported++;
    } catch (error) {
      console.error(`❌ Failed to import "${template.name}":`, error.message);
    }
  }

  await mongoose.disconnect();
  console.log(`\n📊 Summary: ${imported} imported, ${skipped} skipped`);
}

async function importViaAPI() {
  console.log('🌐 Importing templates via API...\n');
  
  if (!apiKey) {
    console.error('❌ API_KEY is required. Provide via --api-key or .env file');
    process.exit(1);
  }

  const axios = require('axios');
  const templatesPath = path.join(__dirname, 'sample-templates.json');
  const templates = JSON.parse(fs.readFileSync(templatesPath, 'utf-8'));

  let imported = 0;
  let skipped = 0;

  for (const template of templates) {
    try {
      // Auto-generate template code from name if not present
      if (!template.code) {
        template.code = template.name
          .toUpperCase()
          .replace(/[^A-Z0-9]+/g, '_')
          .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
      }
      
      const response = await axios.post(
        `${apiUrl}/api/v1/templates`,
        template,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'X-Tenant-Id': tenantId,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`✅ Imported: "${template.name}" (ID: ${response.data.data._id})`);
      imported++;
    } catch (error) {
      if (error.response?.status === 409 || error.response?.data?.message?.includes('exists')) {
        console.log(`⏭️  Skipped: "${template.name}" (already exists)`);
        skipped++;
      } else {
        console.error(`❌ Failed to import "${template.name}":`, error.response?.data?.message || error.message);
      }
    }
  }

  console.log(`\n📊 Summary: ${imported} imported, ${skipped} skipped`);
}

async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  📱 SMS Template Importer');
  console.log('  103 Production-Ready Templates');
  console.log('═══════════════════════════════════════════════════\n');

  if (useApi) {
    console.log(`Mode: API (${apiUrl})`);
    console.log(`Tenant: ${tenantId}\n`);
    await importViaAPI();
  } else {
    console.log('Mode: Direct Database');
    console.log(`Tenant: ${tenantId}\n`);
    await importViaDatabase();
  }

  console.log('\n✨ Done!');
}

main().catch((error) => {
  console.error('\n❌ Import failed:', error.message);
  process.exit(1);
});
