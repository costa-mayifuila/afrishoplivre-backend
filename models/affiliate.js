import mongoose from 'mongoose';

const AffiliateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  affiliateLink: { type: String, required: true, unique: true },
  totalEarnings: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
});

const Affiliate = mongoose.model('Affiliate', AffiliateSchema);

export default Affiliate;
