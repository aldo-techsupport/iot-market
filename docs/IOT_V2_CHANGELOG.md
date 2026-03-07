# IoT API V2 - Changelog

## [2026-02-26] - V2 Implementation

### Added

#### Documentation
- `docs/IOT_API_V2_MIGRATION.md` - Panduan migrasi lengkap dari V1 ke V2
- `docs/IOT_API_V2_EXAMPLES.md` - Contoh implementasi berbagai use case
- `docs/IOT_API_V2_IMPLEMENTATION_SUMMARY.md` - Status dan checklist implementasi
- `docs/IOT_V2_README.md` - Quick reference untuk V2
- `docs/IOT_V2_CHANGELOG.md` - File ini

#### Backend
- `database/migrations/2026_02_26_100000_update_subscription_sensors_for_v2.php`
  - Added `variable_name` column (V1-V20)
  - Added `custom_name` column
  - Added `unit` column
  - Made `sensor_id` nullable

- `database/migrations/2026_02_26_100001_add_v2_fields_to_sensors_table.php`
  - Added `variable_suggestion` column
  - Added `category` column
  - Added `icon` column

- `database/seeders/SensorV2Seeder.php`
  - Seeder untuk sensor dengan format V2
  - Includes 20 sensor templates dengan variable suggestions

### Changed

#### Service Layer
- `app/Services/IoTApiService.php`
  - Updated `getAggregate()` method untuk menggunakan `variable` parameter
  - Added `getAggregateBySensor()` untuk backward compatibility

#### Configuration
- `config/iot-api.php`
  - Added `version` config (v2)
  - Added `available_variables` array (V1-V20)
  - Updated documentation comments

#### Models
- `app/Models/SubscriptionSensor.php`
  - Added fillable fields: `variable_name`, `custom_name`, `unit`
  - Added `isV2()` method
  - Added `getDisplayNameAttribute()` accessor
  - Added `getDisplayUnitAttribute()` accessor
  - Added `toIoTApiFormat()` method

#### Documentation
- `docs/IOT_API_INTEGRATION.md`
  - Updated untuk V2 format
  - Updated contoh kode
  - Added V2 examples

### Deprecated
- `getAggregateBySensor()` method (use `getAggregate()` with variable parameter)

### Breaking Changes
- API aggregate endpoint sekarang menggunakan `variable` parameter instead of `sensor`
- Device creation sekarang memerlukan format V2 dengan custom_name dan unit
- Data sensor sekarang menggunakan v1-v20 instead of sensor names

## Migration Path

### From V1 to V2

1. Run database migrations
2. Update sensor configurations
3. Update frontend UI
4. Test integration
5. Deploy to production

### Backward Compatibility

- V1 format masih supported untuk data lama
- `sensor_id` masih bisa digunakan (nullable)
- Service layer memiliki backward compatibility methods

## Next Steps

### High Priority
- [ ] Implement frontend sensor selection UI
- [ ] Update device activation flow
- [ ] Update monitoring dashboard

### Medium Priority
- [ ] Update admin panel
- [ ] Update email templates
- [ ] Add validation rules

### Low Priority
- [ ] Add helper functions
- [ ] Write tests
- [ ] Update user documentation

## References

- External API Docs: `/www/wwwroot/api-iot/docs/`
- Migration Guide: `docs/IOT_API_V2_MIGRATION.md`
- Examples: `docs/IOT_API_V2_EXAMPLES.md`
- Implementation Status: `docs/IOT_API_V2_IMPLEMENTATION_SUMMARY.md`

---

**Version:** V2.0
**Date:** 2026-02-26
**Status:** 🚧 In Progress
