const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: {type: String, required: true, maxLength: 100},
  family_name: {type: String, required: true, maxLength: 100},
  date_of_birth: {type: Date},
  date_of_death: {type: Date},
});

// virtual for author's full name
AuthorSchema.virtual('name').get(function() {
  // to avoid errors in cases where an author does not have either a family name or first name
  // we want to make sure we handle the exception by returning an empty string for that case
  let fullname = '';
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }
  return fullname;
});

// virtual for author's URL
AuthorSchema.virtual('url').get(function() {
  // we don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

// virtual for author's lifespan
AuthorSchema.virtual('lifespan').get(function() {
  if (this.date_of_birth && this.date_of_death) {
    return `${DateTime.fromJSDate(this.date_of_birth, {zone: 'utc'}).toLocaleString(DateTime.DATE_MED)} - ${DateTime.fromJSDate(this.date_of_death, {zone: 'utc'}).toLocaleString(DateTime.DATE_MED)}`
  } else if (this.date_of_birth && !this.date_of_death) {
    return `${DateTime.fromJSDate(this.date_of_birth, {zone: 'utc'}).toLocaleString(DateTime.DATE_MED)} - present`
  } else {
    return 'Unknown lifespan';
  }
});

// virtual for date of birth formatted for form
AuthorSchema.virtual('form_date_of_birth').get(function() {
  if (this.date_of_birth) {
    return DateTime.fromJSDate(this.date_of_birth, {zone: 'utc'}).toISODate();
  } else {
    return '';
  }

});

// virtual for date of death formatted for form
AuthorSchema.virtual('form_date_of_death').get(function() {
  if (this.date_of_death) {
    return DateTime.fromJSDate(this.date_of_death, {zone: 'utc'}).toISODate();
  } else {
    return '';
  }
});

// export model
module.exports = mongoose.model('Author', AuthorSchema);