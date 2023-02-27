class APIFilters{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    filter(){
        const queryCopy={...this.queryStr};
        //removing fields from query
        const removeFields=['sort','fields','q']
        removeFields.forEach(el=>delete queryCopy[el])
        //advanced filter using lt,lte,gte,gt
        let queryStr=JSON.stringify(queryCopy);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match =>`$${match}`)
        this.query=this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort(){
        if(this.queryStr.sort){
            const sortBy=this.queryStr.sort.split(',').join(' ')
            this.query=this.query.sort(sortBy);
            return this;
        }
        else{
            this.query=this.query.sort('-postingDate');
            return this;
        }
    }
   
  
    limitFields(){

        if(this.queryStr.fields){
            const fields=this.queryStr.fields.split(',').join(' ')
            this.query=this.query.select(fields);
        }
        else{
            this.query=this.query.select('-__v');
        }
        return this;
        //not working as of now
    }
    searchByQuery(){
        if(this.queryStr.q){
            const qu=this.queryStr.q.split('-').join(' ')
            this.query=this.query.find({$text:{$search:"\""+qu+"\""}});
            return this;
        }
    }
    pagination(){
        
            const page=this.queryStr.page;
            const limit=this.queryStr.limit;
            this.query=this.query.skip((page-1)*limit).limit(limit);
        
        return this;
    } 
}
module.exports=APIFilters;