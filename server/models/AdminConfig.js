const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  cities: [{ type: String }],                    // city-based activation
  timeStart: { type: String, default: '' },       // HH:mm 24h – time-based
  timeEnd:   { type: String, default: '' },
  surgePricing: { type: Number, default: 1.0 },   // multiplier
  discount:    { type: Number, default: 0 },       // percentage
}, { _id: false });

const featureToggleSchema = new mongoose.Schema({
  seatSelection: { type: Boolean, default: true },
  liveTracking:  { type: Boolean, default: true },
  aiSuggestions: { type: Boolean, default: true },
}, { _id: false });

const injectedFeatureSchema = new mongoose.Schema({
  id:          { type: String, required: true },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  type:        { type: String, enum: ['discount', 'bundle', 'promotion', 'announcement'], default: 'promotion' },
  active:      { type: Boolean, default: true },
  icon:        { type: String, default: '🎉' },
  color:       { type: String, default: '#9A7EAE' },
  createdAt:   { type: Date, default: Date.now },
});

const adminConfigSchema = new mongoose.Schema({
  // Singleton identifier
  configId: { type: String, default: 'main', unique: true },

  // Service toggles
  services: {
    flights:  { type: serviceSchema, default: () => ({}) },
    buses:    { type: serviceSchema, default: () => ({}) },
    trains:   { type: serviceSchema, default: () => ({}) },
    cabs:     { type: serviceSchema, default: () => ({}) },
    hotels:   { type: serviceSchema, default: () => ({}) },
    holidays: { type: serviceSchema, default: () => ({}) },
  },

  // Feature toggles
  features: { type: featureToggleSchema, default: () => ({}) },

  // Injected features (admin-created promotions)
  injectedFeatures: [injectedFeatureSchema],

  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Pre-save removed — using timestamps: true instead.


// Static helper: get or create the singleton config
adminConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne({ configId: 'main' });
  if (!config) {
    config = await this.create({ configId: 'main' });
  }
  return config;
};

module.exports = mongoose.model('AdminConfig', adminConfigSchema);
