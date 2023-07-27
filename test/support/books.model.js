import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const BookSchema = new Schema({
  author: String,
  description: String,
  genre: String,
  price: Number,
  publish_date: Date,
  title: String
},
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  });

export const BookModel = mongoose.model('Book', BookSchema);

export const BookMetadata = {
  $Key: ['id'],
  id: {
    $Type: 'node.odata.ObjectId'
  },
  author: {
    $Type: 'Edm.String'
  },
  genre: {
    $Type: 'Edm.String'
  },
  price: {
    $Type: 'Edm.Double'
  },
  publish_date: {
    $Type: 'Edm.DateTimeOffset'
  },
  title: {
    $Type: 'Edm.String'
  },
  createdAt: {
    $Type: 'Edm.DateTimeOffset'
  },
  updatedAt: {
    $Type: 'Edm.DateTimeOffset'
  }
};