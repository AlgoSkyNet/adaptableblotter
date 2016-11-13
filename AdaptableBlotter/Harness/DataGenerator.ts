﻿/// <reference path="trade.d.ts" />
export class DataGenerator {

    getTrades(): ITrade[] {
        var trades: ITrade[] = [];
        for (var i = 1; i < 501; i++) {
            var trade = this.createTrade(i);
            trades.push(trade);
        }
        return trades;
    }

    private _numericCols: string[] = ["bid", "ask"];//, "marketPrice", "bloombergAsk", "bloombergBid", "indicativeAsk", "indicativeBid"];

    //Can't be bothered to create a ts file for kendo....
    startTickingDataKendo(grid: kendo.ui.Grid) {
        setInterval(() => {
            let numberToAdd: number = this.generateRandomInt(1, 2) == 1 ? -0.5 : 0.5;
            //pick a random trade in the first ten
            let trade = this.getRandomItem(grid.dataSource.data(), 10);
            //pick a random colum in the numeric col
            let columnName = this.getRandomItem(this._numericCols);
            let initialNewValue = trade[columnName];
            let newValue = initialNewValue + numberToAdd;
            //for now I decide to use dataItem.set but we'll need to see how the fuck people are 
            //managing ticking data since the grid doesn't allow partial refresh... so if we keep calling sync on 
            //every tick the grid becomes unusable since we loose editing, cell selection etc......
            //also if people call sync then we don't have the "change" event

            // JW. Im still not sure that the crude cell.html isnt the easiest after all so long as we make sure it covers all bases
            // as that way at least we dont refresh anything etc and it has no impact.
         //   trade.set(columnName, newValue);

            //trade[columnName] = newValue;
            //trade.dirty = true;
            //grid.dataSource.sync();
        }, 5000)
    }


    createTrade(i: number): ITrade {
        var bid = this.getMeaningfulDouble();
        var trade =
            {
                "tradeId": i,
                "notional": this.getRandomItem(this.getNotionals()),
                "deskId": this.generateRandomInt(0, 250),
                "counterparty": this.getRandomItem(this.getCounterparties()),
                "currency": this.getRandomItem(this.getCurrencies()),
                "country": this.getRandomItem(this.getCountries()),
                "marketPrice": this.getMeaningfulPositiveNegativeDouble(),
                "bid": bid,
                "ask": this.roundTo4Dp(bid + this.getMeaningfulDoubleInRange(0, 1)),
                "isLive": this.generateRandomBool(),
                "fitchRating": this.getRandomItem(this.getFitchRatings()),
                "moodysRating": this.getRandomItem(this.getMoodysRatings()),
                "tradeDate": this.generateRandomDateAndTime(-5000, 0),
                "settlementDate": this.generateRandomDate(0, 5000),
                "bloombergAsk": this.getMeaningfulDouble(),
                "bloombergBid": this.getMeaningfulDouble(),
                "indicativeAsk": this.getMeaningfulDouble(),
                "indicativeBid": this.getMeaningfulDouble(),
                "delta": this.getMeaningfulDoubleTest(),
                "occasionalPrice": this.generateRandomNullableDouble(),
                "bookingGuid": this.generateUuid(),
                "lastUpdated": this.generateRandomDateAndTime(-7, 0),
                "lastUpdatedBy": this.getRandomItem(this.getNames())
            };
        return trade;
    }

    //jo: just a poor attempt to create GUID in JS.... what a stupid language
    protected generateUuid(): string {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
            c => {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
            });
        return uuid;
    }

    // If minValue is 1 and maxValue is 2, then Math.random()*(maxValue-minValue+1)
    // generates a value between 0 and 2 =[0, 2), adding 1 makes this
    // [1, 3) and Math.floor gives 1 or 2.
    public generateRandomInt(minValue: number, maxValue: number): number {
        return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
    }


    protected generateRandomBool(): boolean {
        var amount = this.generateRandomInt(0, 1);
        return amount === 0;
    }

    // [0, 1)
    protected generateRandomDouble(): number {
        return Math.random();
    }


    protected generateRandomNullableDouble(): number {
        var myValue = this.generateRandomDouble();
        var randomInt = this.generateRandomInt(1, 10);
        if (randomInt > 7) {
            myValue = null;
        }

        if (randomInt % 2 === 0 && myValue != null) {
            myValue = myValue * -1;
        }

        return myValue;
    }

    protected generateRandomNullableString(myString: string): string {
        var randomInt = this.generateRandomInt(1, 10);
        if (randomInt > 7) {
            myString = null;
        }
        return myString;
    }

    protected getMeaningfulDouble(): number {
        return this.roundTo4Dp(this.generateRandomInt(10, 150) + this.generateRandomDouble());
    }

    protected getMeaningfulPositiveNegativeDouble(): number {
        return this.roundTo4Dp(this.generateRandomInt(-150, 150) + this.generateRandomDouble());
    }

    protected roundTo4Dp(val: number): number {
        return Math.round(val * 10000) / 10000;
    }

    protected getMeaningfulDoubleInRange(min: number, max: number): number {
        return this.roundTo4Dp(this.generateRandomInt(min, max) + this.generateRandomDouble());
    }

    protected getMeaningfulDoubleTest(): number {
        return (Math.round((100 + this.generateRandomDouble()) * 10) / 10) + this.generateRandomDouble() / 1000;
    }

    protected generateRandomDateAndTime(minDays: number, maxDays: number): Date {
        var currentDate = new Date(); // Fix it
        var start = this.addDays(currentDate, minDays);
        var end = this.addDays(currentDate, maxDays);
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    protected addDays(date: Date, days: number): Date {
        return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
    }

    protected generateRandomDate(minDays: number, maxDays: number): Date {
        var date = this.generateRandomDateAndTime(minDays, maxDays);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        //return toDateTimeString(date);
    }

    protected toDateTimeString(date: Date) {
        var options = {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        };
        return date.toLocaleTimeString("en-us", options);
    }

    protected generateCounterparty(): string {
        var counterparties = this.getCounterparties();
        return counterparties[this.generateRandomInt(0, counterparties.length - 1)];
    }

    protected generateCurrency(): string {
        var currencies = this.getCurrencies();
        return currencies[this.generateRandomInt(0, currencies.length - 1)];
    }

    public getRandomItem(ary: any[] | kendo.data.ObservableArray, max?: number): any {
        if (max) {
            return ary[this.generateRandomInt(0, Math.min(max, ary.length - 1))];
        }
        else {
            return ary[this.generateRandomInt(0, ary.length - 1)];
        }
    }

    protected getNotionals(): number[] {
        var notionals = [
            1000000,
            2000000,
            5000000,
            7500000,
            10000000
        ];
        return notionals;
    }
    protected getCounterparties(): string[] {
        var counterparties = [
            "Goldman Sachs",
            "Societe Generale",
            "Bank of America",
            "RBS",
            "Barcap",
            "JP Morgan",
            "Morgan Stanley",
            "BNP",
            "Royal Bank of Canada",
            "Lloyds TSB",
            "MUFJ",
            "Rabobank",
            "Deutsche Bank",
            "Credit Suisse",
            "Nomura"
        ];
        return counterparties;
    }

    protected getCurrencies(): string[] {
        var currencies = [
            "EUR",
            "USD",
            "GBP",
            "CHF",
            "CAD",
            "AUD",
            "ZAR"
        ];
        return currencies;
    }

    protected getCountries(): string[] {
        var countries = [
            "Australia",
            "Belgium",
            "Brazil",
            "Canada",
            "China",
            "Denmark",
            "Egypt",
            "France",
            "Germany",
            "Hungary",
            "India",
            "Ireland",
            "Italy",
            "Japan",
            "Kenya",
            "Portugal",
            "Qatar",
            "Russia",
            "South Korea",
            "Spain",
            "United Kingdom",
            "United States"
        ];
        return countries;
    }

    protected getMoodysRatings(): string[] {
        var moodysRatings = [
            "Baa1",
            "Baa2",
            "Baa3",
            "Ba1",
            "Ba3",
            "B1",
            "B2",
            "B3",
            "(P)B3",
            "Ba2",
            "Aaa",
            "Aa1",
            "Aa2",
            "Aa3",
            "A1",
            "A2",
            "A3",
            "Caa1",
            "Caa2",
            "Caa3",
            "Ca",
            "C",
            "WR",
            "NR",
            "Undefined"
        ];
        return moodysRatings;
    }

    protected getFitchRatings(): string[] {
        var fitchRatings = [
            "AAA",
            "AA",
            "AA-",
            "A+",
            "A+(EXP)",
            "A",
            "A-",
            "A(EXP)",
            "A-(EXP)",
            "BBB+",
            "BBB",
            "BBB-",
            "BB+",
            "BB",
            "BB-",
            "B",
            "CCC",
            "CC",
            "C",
            "D",
            "NR",
            "F1+",
            "F1",
            "F2",
            "F3",
            "WR",
            "Undefined"
        ];
        return fitchRatings;
    }

    protected getSAndPRatings(): string[] {
        var spRatings: string[] = [
            "AAA",
            "AA+",
            "AA",
            "AA-",
            "A+",
            "A",
            "BBB+",
            "BBB",
            "BBB-",
            "BB+",
            "BB",
            "BB-",
            "B",
            "CCC",
            "CC",
            "C",
            "R",
            "SD",
            "N",
            "NR",
            "WR",
            ""
        ];
        return spRatings;
    }

    protected getNames(): string[] {
        var names: string[] = [
            "Stacee Dreiling",
            "Cecil Staab",
            "Sheba Dowdy",
            "Loralee Stalker",
            "Sanjuana Kimsey",
            "Shante Hey",
            "Magen Willison",
            "Casimira Tabler",
            "Annemarie Rybicki",
            "Granville Westfall",
            "Colby Troupe",
            "Wei Frith",
            "Sarai Pilgrim",
            "Yael Rich",
            "Hester Bluhm",
            "Season Landreth",
            "Britany Saffell",
            "Kelley Babb",
            "Bradley Chumley",
            "Louella Spiker"
        ];
        return names;
    }
}