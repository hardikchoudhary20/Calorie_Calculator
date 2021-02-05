//storage controller 

//item controller

const ItemCtrl = (function () {


    // //id of foof and its name and its calories 
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }




    // //data structure / state 
    const data = {

        //     //item is private (module pattern)
        items: [
            // {
            //                 id: 0,
            //                 name: "apple",
            //                 calories: 200
            //             },
            //             {

            //                 id: 1,
            //                 name: "eggs",
            //                 calories: 300
            //             },
            //             {
            //                 id: 3,
            //                 name: "maggi",
            //                 calories: 700
            //             }
        ],
        currentItem: null,
        totalCalories: 0
    };

    //public methods    
    return {
        GetItems: function () {
            return data.items;
        },
        addItem: function (name, calories) {
            let ID;

            //create ID

            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
                console.log(ID)
            }
            else {
                ID = 0;
            }

            //calories to no 
            calories = parseInt(calories);

            //create a new item
            newItem = new Item(ID, name, calories)
            //add to items array
            data.items.push(newItem);
            return newItem;
        },
        getTotalCalorie: function () {
            let total = 0;

            //looping though data 
            data.items.forEach(function (item) {
                total += item.calories;
            });
            //set total calories in data structure 
            data.totalCalories = total;


            //reutrn total 
            return data.totalCalories;



        },

        logData: function () {
            return data;
        }



        //from here we can access the above private  functions 


    }
})();



//UI controller
const UIctrl = (function () {

    const UIselectors = {
        itemlist: "#item-list",
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesinput: '#item-calorie',
        totalcalories: ".total-calories"

    }

    //public methods 
    return {

        populateItemList: function (items) {
            let html = '';

            items.forEach(function (item) {

                html = html + `<li class="collection-item" id="item-${item.id}" >
                <strong> ${item.name}:  </strong>
               <em>  ${item.calories} calories </em>
      <a href="#" class="secondary-content">
    <i class="icon-pencil"></i></a>
     </li>`;
            });


            //isert li items into UI 

            document.querySelector(UIselectors.itemlist).innerHTML = html;

        },
        getItemInput: function () {
            return {
                name: document.querySelector(UIselectors.itemNameInput).value,
                calories: document.querySelector(UIselectors.itemCaloriesinput).value
            }
        },
        addListItem: function (item) {
            document.querySelector(UIselectors.itemlist).style.display = 'block';

            const li = document.createElement('li');
            //add class
            li.className = 'collection-item';
            //add id
            li.id = `item-${item.id}`
            li.innerHTML = `  <strong> ${item.name}:  </strong>
            <em>  ${item.calories} calories </em>
<a href="#" class="secondary-content">
 <i class="icon-pencil"></i></a>`

            //insert item 
            document.querySelector(UIselectors.itemlist).insertAdjacentElement('beforeend', li);

        },
        clearInput: function () {
            document.querySelector(UIselectors.itemNameInput).value = ''
            document.querySelector(UIselectors.itemCaloriesinput).value = ''

        },
        hideList: function () {
            document.querySelector(UIselectors.itemlist).style.display = 'none';
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UIselectors.totalcalories).innerHTML = `${totalCalories}`;

        },
        getSelectors: function () {
            return UIselectors;
        }
    }
})()

//App controller


const Appctrl = (function (ItemCtrl, UIctrl) {
    // console.log(ItemCtrl.logData());

    //load event listeners 

    const loadEventListerners = function () {

        //get UI selectors 
        const UIselectors = UIctrl.getSelectors();

        //add-item event 
        document.querySelector(UIselectors.addBtn).addEventListener('click',
            function itemaddSubmit(e) {
                // console.log("Add")

                //get form input from UI controller 
                const input = UIctrl.getItemInput();


                if (input.name !== '' && input.calories !== '') {
                    const newItem = ItemCtrl.addItem(input.name, input.calories);
                }
                //checking wheter input is empty or not 
                else if (input.name == '') {
                    alert("please enter a food item")
                }
                else if (input.calories == "") {
                    alert("please enter calories")
                }

                //add item to UI 
                UIctrl.addListItem(newItem);

                //get total cal 
                const totalCalories = ItemCtrl.getTotalCalorie();


                //add total cal to UI
                UIctrl.showTotalCalories(totalCalories);

                //clear fiels 
                UIctrl.clearInput();

                e.preventDefault();
            });

    }


    //add item submit




    //public methods 
    return {
        init: function () {

            //fetch items from datastructure 
            const items = ItemCtrl.GetItems();


            //check if any items 
            if (items.length === 0) {
                UIctrl.hideList();
            }

            else {
                //populate item list 
                UIctrl.populateItemList(items);
                //load event listeners 
            }

            //putted show totaal cal here as we want when our app intilizes
            // we have total calories there 
            //this will be done better when we have local storage 
            
            //get total cal 
            const totalCalories = ItemCtrl.getTotalCalorie();


            //add total cal to UI
            UIctrl.showTotalCalories(totalCalories);

            loadEventListerners();
        }



    }


})(ItemCtrl, UIctrl)


//initialize app 
Appctrl.init();

