'use strict';

const fs = require('fs');
const path = require('path');
const SmsTemplate = require('../models/SmsTemplate');
const logger = require('../utils/logger');

/**
 * Auto-import SMS templates on application startup
 * Idempotent - skips templates that already exist
 */
async function autoImportTemplates(options = {}) {
  const { 
    tenantId = process.env.DEFAULT_TENANT_ID || 'default',
    silent = false 
  } = options;

  try {
    if (!silent) {
      logger.info('📱 Auto-importing SMS templates...');
    }

    // Load templates from sample-templates.json
    const templatesPath = path.join(__dirname, '..', '..', 'sample-templates.json');
    
    if (!fs.existsSync(templatesPath)) {
      logger.warn('Sample templates file not found. Skipping auto-import.');
      return { imported: 0, skipped: 0, error: 'File not found' };
    }

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
            .replace(/^_+|_+$/g, '');
        }
        
        // Check if template already exists by code or name
        const existing = await SmsTemplate.findOne({ 
          $or: [
            { code: template.code, tenantId },
            { name: template.name, tenantId }
          ]
        });
        
        if (existing) {
          skipped++;
          continue;
        }

        await SmsTemplate.create(template);
        imported++;
      } catch (error) {
        // Skip individual template errors (likely duplicates)
        skipped++;
      }
    }

    if (!silent) {
      logger.info(`✅ Templates imported: ${imported} new, ${skipped} skipped (${imported + skipped} total)`);
    }
    
    return { imported, skipped, total: imported + skipped };
  } catch (error) {
    logger.error('Failed to auto-import templates', { error: error.message });
    return { imported: 0, skipped: 0, error: error.message };
  }
}

module.exports = { autoImportTemplates };
