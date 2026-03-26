export class Supplier{
    #ssc;
    #name;
    #phone;
    #email;
    #continent;
    #country;
    #city;
    #street;
    constructor(ssc,name,phone,email,continent,country,city,street){
        this.#ssc=ssc;
        this.#name=name;
        this.#phone=phone;
        this.#email=email;
        this.#continent=continent;
        this.#country=country;
        this.#city=city;
        this.#street=street;
    }
    set SSC(ssc){
        this.#ssc=ssc;
    }
    get SSC(){
        return this.#ssc;
    }
    set NAME(name){
        this.#name=name;
    }
    get NAME(){
        return this.#name;
    }
    set PHONE(phone){
        this.#phone=phone;
    }
    get PHONE(){
        return this.#phone;
    }
    set EMAIL(email){
        this.#email=email;
    }
    get EMAIL(){
        return this.#email;
    }
    set CONTINENT(continent){
        this.#continent=continent;
    }
    get CONTINENT(){
        return this.#continent;
    }
    set COUNTRY(country){
        this.#country=country;
    }
    get COUNTRY(){
        return this.#country;
    }
    set CITY(city){
        this.#city=city;
    }
    get CITY(){
        return this.#city;
    }
    set STREET(street){
        this.#street=street;
    }
    get STREET(){
        return this.#street;
    }
}