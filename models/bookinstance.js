const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema({
  book: {type: Schema.Types.ObjectId, ref: 'Book', required: true}, // reference to the associated book
  imprint: {type: String, required: true},
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
    default: 'Maintenance',
  },
  due_back: {type: Date, default: Date.now},
});

// virtual for bookinstance's URL
BookInstanceSchema.virtual('url').get(function() {
  // we don't use an arrow function as we'll need the this object
  return `/catalog/bookinstance/${this._id}`;
});

// virtual for formatted date
BookInstanceSchema.virtual('due_back_formatted').get(function() {
  if (this.due_back) {
    return DateTime.fromJSDate(this.due_back, {zone: 'utc'}).toLocaleString(DateTime.DATE_MED);
  } else {
    return 'No due date'
  }
});

// virtual due_back_yyyy_mm_dd() method
BookInstanceSchema.virtual('due_back_yyyy_mm_dd').get(function () {
  if (this.due_back) {
    return DateTime.fromJSDate(this.due_back, {zone: 'utc'}).toISODate(); // format 'YYYY-MM-DD'
  } else {
    return '';
  }
});

// export module
module.exports = mongoose.model('BookInstance', BookInstanceSchema);
