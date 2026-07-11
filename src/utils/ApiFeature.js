export class ApiFeature {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  paginate() {
    let page = this.queryString.page * 1 || 1;
    if (this.queryString.page <= 0) page = 1;
    this.page = page;
    let skip = (page - 1) * 6;
    this.mongooseQuery.skip(skip).limit(6);
    return this;
  }

  filter() {
    let filterObject = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields", "keyword"];
    excludeFields.forEach((ele) => {
      delete filterObject[ele];
    });
    filterObject = JSON.stringify(filterObject);
    filterObject = filterObject.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`,
    );
    filterObject = JSON.parse(filterObject);
    this.mongooseQuery.find(filterObject);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      let sortQuery = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery.sort(sortQuery);
    }
    return this;
  }
  search() {
    if (this.queryString.keyword) {
      console.log(this.queryString.keyword);
      this.mongooseQuery.find({
        $or: [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ],
      });
    }
    return this;
  }
  selectedFields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery.select(fields);
    }
    return this;
  }
}
