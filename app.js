//Budget
var budgetController = (function(){

    var Expense = function(id, description, value, date){
        this.id = id;
        this.description = description;
        this.value = value;
        this.date = date;
        this.percentage = -1;
    }

    /** 
    var calcPercentage = function(totalIncome){

        data.allItems.exp.forEach(cur => {

            if (totalIncome > 0) {
                cur.percentage = Math.round(cur.value / totalIncome * 100);
            }else{
                cur.percentage = -1;
            };
            
        })
    }
    */
    /** 
    Expense.prototype.getPercentage = function(){

        return this.percentage;
    }
    */

    var Income = function(id, description, value, date){
        this.id = id;
        this.description = description;
        this.value = value;
        this.date = date;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },

       totals: {
           exp: 0,
           inc: 0
       },
       budget: 0,
       percentage: -1   
    }

    function calculateTotal(type){
        var sum = 0; 
        data.allItems[type].forEach(function(cur){
            sum += cur.value; 
        });

        data.totals[type] = sum;
    }

    return{
        getData: function(){
            return data
        },

        saveBudget: function(){
            localStorage.setItem('budget', JSON.stringify(data.budget))
        },

        savePercentage: function(){
            localStorage.setItem('percentage', JSON.stringify(data.percentage))
        },

        saveExp: function(){
            localStorage.setItem('totalExp', JSON.stringify(data.totals.exp))
        },

        saveInc: function(){
            localStorage.setItem('totalInc', JSON.stringify(data.totals.inc))
        },

        saveExpData: function(){
            localStorage.setItem('exp', JSON.stringify(data.allItems.exp))
        },
    
        saveIncData: function(){
            localStorage.setItem('inc', JSON.stringify(data.allItems.inc))
        },

        readExp: function(){
            return JSON.parse(localStorage.getItem('totalExp'))
        },

        readInc: function(){
            return JSON.parse(localStorage.getItem('totalInc'))
        },

        readPercentage: function(){
            return JSON.parse(localStorage.getItem('percentage'))
        },

        readBudget: function(){
            return JSON.parse(localStorage.getItem('budget'))
        },

        readIncData: function(){
            return JSON.parse(localStorage.getItem('inc'))
        },

        readExpData: function(){
            return JSON.parse(localStorage.getItem('exp'))
        },

        addItems: function(type, des, val, date){
            var newItem, ID, lastItem

            lastItem = data.allItems[type];

            //Create new Id
            if (lastItem.length == 0){
                ID = 0;
            }else{
                ID = lastItem[lastItem.length-1].id + 1;
            }

            //Create new Item
            if(type == "exp"){
                newItem = new Expense(ID, des, val, date); 
            }else{
                newItem = new Income(ID, des, val, date);
            }

            data.allItems[type].push(newItem);

            return newItem;
        },

        deleteItem: function(type, id){
            var ids, index

            ids = data.allItems[type].map(function(cur){
                return cur.id;
            })

            index = ids.indexOf(id);

            //All index is defined since index is found on the UI
            data.allItems[type].splice(index, 1);

        },

        calculateBudget: function(){
            calculateTotal('exp');
            calculateTotal('inc');

            data.budget = data.totals.inc - data.totals.exp;

            if (data.totals.inc > 0){
                data.percentage =  Math.round(data.totals.exp / data.totals.inc * 100); 
            }else{
                data.percentage = -1;
            }
         
        },

        calculatePercentage: function(){
            var totalIncome

            totalIncome = data.totals.inc;
            console.log(data)
            data.allItems.exp.forEach(function(cur){

                if (totalIncome > 0) {
                    cur.percentage = Math.round(cur.value / totalIncome * 100);
                }else{
                    cur.percentage = -1;
                };

            })
            
        },

        getPercentages: function(){

            var allPercentage = data.allItems.exp.map(function(cur){
                return cur.percentage;
            })

            return allPercentage;
        },

        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function(){
            console.log(data);
        }
    }

})()


//UI
var UICntroller = (function(){

    //All the string name for class/id for DOM
    var DOMstr = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
        totalValue: ".budget__value",
        incomeValue: ".budget__income--value",
        expenseValue: ".budget__expenses--value",
        expensePercentage: ".budget__expenses--percentage",
        container: ".container",
        itemPercentage: ".item__percentage",
        date: ".budget__title--month",
        showDate: ".item__date"
    };

    var formatNumber = function(num, type){
        var numSplit, int, dec, index, intArr, intHead, intRem, sign 

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');

        int = numSplit[0];

        index = int;

        intRem = "";

        /*
        First Loop
        intRem = ""
        int = "1234567890"
        index = "1234567890"
        int = "1234567,890"
        intArr = ["1234567", "890"]
        intHead = "1234567"
        intRem = ",890"
        index = "1234567"

        Second Loop
        int = 1234,567,890
        intArr = [1234,567,890]
        intHead = "1234"
        intRem = ",567,890"
        index = "1234"

        Third Loop
        int = "1,234,567,890"
        intArr = [1,234,567,890]
        intHead = 1
        intRem = ",234,567,890"
        index = "1"
        */
        while(index.length > 3){

            int = index.substr(0, index.length-3) + ',' + index.substr(index.length-3) + intRem

            intArr = int.split(',');
            intHead = intArr[0];
            intRem = "," + intArr[1] + intRem;

            index = intHead;
        }

        dec = numSplit[1];

        type == "inc" ? sign = "+" : sign = "-";

        return sign + " " + int + "." + dec;

    };

    function nodeListForEach(nodeList,func){
        for(var i = 0; i < nodeList.length; i++){
            func(nodeList[i], i);
        }
    };

    return{
        getInput: function(){
            return{
                type: document.querySelector(DOMstr.inputType).value,
                description: document.querySelector(DOMstr.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstr.inputValue).value)
            }
        },

        addListItem: function(item, type){
            var html, newHtml, element, value;

            if (type == "inc"){
                element = DOMstr.incomeContainer; 
                html = '<div class="item clearfix" id="inc-%id%"><div class = "item__date"><b>%date%</b></div><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else{
                element = DOMstr.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class = "item__date"><b>%date%</b></div><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            value = formatNumber(item.value, type);

            newHtml = html.replace('%id%',  item.id);
            newHtml = newHtml.replace('%description%', item.description);
            newHtml = newHtml.replace('%value%', value);
            newHtml = newHtml.replace('%date%', item.date);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); 

        },

        deleteListItem: function(classId){

            var el = document.getElementById(classId)
            el.parentNode.removeChild(el);

        },

        clearFields: function(){
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMstr.inputDescription + ", " + DOMstr.inputValue); 

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(cur){
                cur.value = "";
            })

            fieldsArray[0].focus();
        
        },

        displayBudget: function(obj){
            var sign;

            obj.budget > 0 ? sign = "inc" : sign = "exp";

            document.querySelector(DOMstr.totalValue).textContent = formatNumber(obj.budget, sign);
            document.querySelector(DOMstr.incomeValue).textContent = formatNumber(obj.totalInc, "inc");
            document.querySelector(DOMstr.expenseValue).textContent = formatNumber(obj.totalExp, "exp");

            if (obj.percentage > 0){
                document.querySelector(DOMstr.expensePercentage).textContent = obj.percentage + "%";
            }else{
                document.querySelector(DOMstr.expensePercentage).textContent = "---";
            }

        },

        displayPercentage: function(allPercentage){
            var fields

            fields = document.querySelectorAll(DOMstr.itemPercentage); 

            nodeListForEach(fields, function(cur, i){

                if (allPercentage[i] > 0){
                    cur.textContent = allPercentage[i] + "%";
                }else{
                    cur.textContent = "---";
                }
                
            })

        },

        displayMonth: function(){
            var curDate, year, month, months;

            curDate = new Date();

            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

            year = curDate.getFullYear();
            month = curDate.getMonth();

            document.querySelector(DOMstr.date).textContent = months[month] + " " + year;

        },

        changeUX: function(){
            var fields;

            fields = document.querySelectorAll(
                DOMstr.inputType + "," +
                DOMstr.inputDescription + "," +
                DOMstr.inputValue
            )

            document.querySelector(DOMstr.inputBtn).classList.toggle("red");

            nodeListForEach(fields, function(cur){
                cur.classList.toggle("red-focus");
            });

        },

        getDOMstr: function(){
            return DOMstr;
        }

    }

})()


//Global control
var controller = (function(budget, ui){

    function setUpEventListeners(){
         
        var DOM = ui.getDOMstr();

        
        window.addEventListener('load', () => {
            const data = budget.getData()
            const inc = budget.readIncData()
            const exp = budget.readExpData()
            
            if(inc) data.allItems.inc = inc
            if(exp) data.allItems.exp = exp

            if(data.allItems.inc) data.allItems.inc.forEach(el => ui.addListItem(el, 'inc'))
            
            if(data.allItems.exp) {
                data.allItems.exp.forEach(el => {
                    ui.addListItem(el, 'exp')
                    //document.querySelector(DOM.itemPercentage).textContent = el.percentage <= 0 ? '---' : el.percentage + "%"
                })
            }

            updatePercentage();

            console.log(data)

        })
        

        //Event listener for adding item
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem) ;
        document.addEventListener("keypress", function(event){
            if(event.keyCode == 13 && event.which == 13){
                ctrlAddItem();
            }
        });

        //Event listeneer for deleting item
        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);

        //Event listener for changing type
        document.querySelector(DOM.inputType).addEventListener("change", ui.changeUX);

    }

    var getDate = function(){
        var curDate, year, month, months;

        curDate = new Date();

        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        year = curDate.getFullYear();
        month = curDate.getMonth();

        return months[month] + " " + year;

    }

    var updateBudget = function(){
        var allBudget

        budget.calculateBudget();
 
        allBudget = budget.getBudget();

        ui.displayBudget(allBudget);

    }

    var updatePercentage = function(){

        budget.calculatePercentage();

        var allPercentage = budget.getPercentages();
        console.log(allPercentage)

        ui.displayPercentage(allPercentage);
        
    }

    function ctrlAddItem(){
        var input, newItem, date
        
        input = ui.getInput();

        date = getDate();

        if (input.description != "" && !isNaN(input.value) && input.value > 0){

            newItem = budget.addItems(input.type, input.description, input.value, date);

            ui.addListItem(newItem, input.type);

            ui.clearFields();
            
            updateBudget();

            updatePercentage();

            budget.saveIncData()
            budget.saveExpData()
            budget.saveBudget()
            budget.saveExp()
            budget.saveInc()
            budget.savePercentage()

        }
    }

    function ctrlDeleteItem(event){
        var itemId, splitId, type, id;
        console.log(event.target)

        if (event.target.matches('.item__delete, .item__delete *')){
            itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
            console.log(itemId)
            if (itemId){
                splitId = itemId.split("-");
                type = splitId[0]
                id = parseInt(splitId[1]);
            }
    
            budget.deleteItem(type, id);
    
            ui.deleteListItem(itemId);
    
            updateBudget();
    
            updatePercentage();
        }
        

        

        budget.saveIncData()
        budget.saveExpData()
        budget.saveBudget()
        budget.saveExp()
        budget.saveInc()
        budget.savePercentage()
    }

    return{
        init: function(){
            const data = budget.getData()

            data.budget = budget.readBudget() ? budget.readBudget() : 0
            data.percentage = budget.readPercentage() ? budget.readPercentage() : -1
            data.totals.exp = budget.readExp() ? budget.readExp() : 0
            data.totals.inc = budget.readInc() ? budget.readInc() : 0

            ui.displayBudget({
                budget: budget.readBudget() ? budget.readBudget() : 0,
                totalInc: budget.readInc() ? budget.readInc() : 0,
                totalExp: budget.readExp() ? budget.readExp() : 0,
                percentage: budget.readPercentage() ? budget.readPercentage() : "---"
            });

            /** 
            if(budget.readIncData()){
                data.allItems.inc.forEach(el => ui.addListItem(el, 'inc'))
            }

            if(budget.readExpData()){
                data.allItems.exp.forEach(el => ui.addListItem(el, 'exp'))
            }
            */
            
            ui.displayMonth();

            setUpEventListeners();
        }
    } 

})(budgetController, UICntroller)

//Onle line of code outside of the controllers
controller.init();