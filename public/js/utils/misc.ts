interface Array<T> {
    flatMap<E>(callback: (t: T) => Array<E>): Array<E>
    groupBy<E>(callback: (t: T) => E): Array<Array<T>>
    unique<T>():Array<T>
    flatten<T>():Array<T>
}

Object.defineProperty(Array.prototype, "unique", {
    value: function(){
        return this.filter((a, index)=>{
            return this.indexOf(a) === index;
        });
    }
});

Object.defineProperty(Array.prototype, 'flatten', {
    value: function(f: Function) {
        var b = [];
        this.forEach(a => a.forEach(i => b.push(i)));
        return b;
    },
    enumerable: false,
});

Object.defineProperty(Array.prototype, 'flatMap', {
    value: function(f: Function) {
        return this.reduce((ys: any, x: any) => {
            return ys.concat(f.call(this, x))
        }, [])
    },
    enumerable: false,
});

Object.defineProperty(Array.prototype, 'groupBy', {
    value: function(f: Function){
        var values = this.map(f);
        var unique = values.unique();
        var lists = unique.map(v => {return []});
        this.forEach((o, index) => {
            var v = values[index];
            lists[unique.indexOf(v)].push(o);
        });
        return lists;
    }
});


interface Option<A>{
    get<AT>():A;
    getOrElse<A>(b:A):A;
    orElse<A>(b:Option<A>):Option<A>;
    map<B>(f:(a:A)=>B):Option<B>;
}

class Some<A> extends Option {
    private a:A;
    constructor(a:A){
        super();
        this.a = a;
    }
    get<A>(){return this.a}
    getOrElse<A>(b:A){return this.a;}
    orElse<A>(b:Option<A>){return this}
    map<B>(f:(a:A)=>B){
        f(this.a)
    }
}