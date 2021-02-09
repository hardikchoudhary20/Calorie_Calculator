//storage controller 
const StorageCtrl = (function(){
   

    //public methods 
    return{
        storeItem:function(item){
            let items;
            //check if any items in local storage 

            if(localStorage.getItem('items')=== null){

                  items =[];

                  //push the new item 
                  items.push(item);

                  //se item to local storage 
                  localStorage.setItem('items',JSON.stringify(items));

            }
            else{
                    //get what already is in local storage  
                    items= JSON.parse(localStorage.getItem('items'))

                    //push the new item 
                     items.push(item);

                    // reset local storage 
                    localStorage.setItem('items',JSON.stringify(items));

            }

        },
        getItemfromStorage:function(){

            let items;
            if(localStorage.getItem('items')=== null){
                    items= [];

            }
            else{
                items= JSON.parse(localStorage.getItem('items'));
            }
            return items;

        }
    }
})();

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
        // items: [
        //     // {
        //     //                 id: 0,
        //     //                 name: "apple",
        //     //                 calories: 200
        //     //             },
        //     //             {

        //     //                 id: 1,
        //     //                 name: "eggs",
        //     //                 calories: 300
        //     //             },
        //     //             {
        //     //                 id: 3,
        //     //                 name: "maggi",
        //     //                 calories: 700
        //     //             }
        // ],
        items:StorageCtrl.getItemfromStorage(),
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
        getItemById: function (id) {
            let found = null;

            //loop through items 
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item
                }

            })
            return found;


        },
        updateItem: function (name, calories) {

            //calories to numbers 
            calories = parseInt(calories);
            let found = null;

            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories
                    found = item;
                }
            })
            return found;

        },
        deleteItem: function (id) {

            //get ids
            const ids = data.items.map(function (item) {
                return item.id
            });

            //get index 

            const index = ids.indexOf(id);


            //remove item 

            data.items.splice(index,1);



        },
        clearAllItems:function(){
               data.items=[];
        },

        setCurrentItem: function (item) {
            data.currentItem = item;

        },
        getCurrentItem: function () {
            return data.currentItem;
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
        totalcalories: ".total-calories",
        updateBtn: '.update-btn',
        clearBtn:'.clear-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        listItems: '#item-list li'





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
            <i class="edit-item icon-pencil"></i></a>`

            //insert item 
            document.querySelector(UIselectors.itemlist).insertAdjacentElement('beforeend', li);

        },
        clearInput: function () {
            document.querySelector(UIselectors.itemNameInput).value = ''
            document.querySelector(UIselectors.itemCaloriesinput).value = ''

        },
        addItemtoForm: function () {
            document.querySelector(UIselectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UIselectors.itemCaloriesinput).value = ItemCtrl.getCurrentItem().calories;
            UIctrl.showEditState();

        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UIselectors.listItems);

            // turn node list into aray 
            listItems = Array.from(listItems);

            listItems.forEach(function (listItem) {
                const itemID = listItem.getAttribute('id');

                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `  <strong> ${item.name}:  </strong>
                   <em>  ${item.calories} calories </em>
                   <a href="#" class="secondary-content">
                   <i class="edit-item icon-pencil"></i></a>`


                }
            }
            )



        },
        deleteListItem: function (id) {
            const itemID = `#item-${id}`
            const item = document.querySelector(itemID);
            item.remove();

        },




        hideList: function () {
            document.querySelector(UIselectors.itemlist).style.display = 'none';
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UIselectors.totalcalories).innerHTML = `${totalCalories}`;

        },
        removeItems:function(){
              let listItems = document.querySelectorAll(UIselectors.listItems);
              
              //turn the above listitems into array 

              listItems= Array.from(listItems);

             listItems.forEach(function(item){
                 item.remove()

             })
        },
        clearEditState: function () {
            UIctrl.clearInput();
            document.querySelector(UIselectors.updateBtn).style.display = 'none';
            document.querySelector(UIselectors.deleteBtn).style.display = 'none';
            document.querySelector(UIselectors.backBtn).style.display = 'none';
            document.querySelector(UIselectors.addBtn).style.display = 'inline';


        },
        showEditState: function () {
            document.querySelector(UIselectors.updateBtn).style.display = 'inline';
            document.querySelector(UIselectors.deleteBtn).style.display = 'inline';
            document.querySelector(UIselectors.backBtn).style.display = 'inline';
            document.querySelector(UIselectors.addBtn).style.display = 'none';


        },
        getSelectors: function () {
            return UIselectors;
        }
    }
})()

//App controller


const Appctrl = (function (ItemCtrl, UIctrl, StorageCtrl) {
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



                //store in local storage 
                StorageCtrl.storeItem(newItem);
                //clear fiels 
                UIctrl.clearInput();

                e.preventDefault();
            });

        //disable submit on enter 
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        })
        //add event listerer to pencil icon
        document.querySelector(UIselectors.itemlist).addEventListener('click',
            function itemEditClick(e) {
                //targeting only pencil icon 
                if (e.target.classList.contains('edit-item')) {


                    //get list item ID 
                    const listId = e.target.parentNode.parentNode.id


                    //break into array 
                    const listIdArr = listId.split('-');

                    //get actual id 
                    const id = parseInt(listIdArr[1]);


                    //get item 
                    const itemtoEdit = ItemCtrl.getItemById(id);
                    // console.log(itemtoEdit.id)

                    //set item to cuurent item 
                    ItemCtrl.setCurrentItem(itemtoEdit);

                    //add item to form 
                    UIctrl.addItemtoForm();

                }
                e.preventDefault();
            });




        //add event listerer toupdate button 
        document.querySelector(UIselectors.updateBtn).addEventListener('click',

            function itemUpdateSubmit(e) {
                //get item input
                const input = UIctrl.getItemInput();

                //update item 
                const updateItem = ItemCtrl.updateItem(input.name, input.calories);


                //update ui
                //put updated item on the UI 
                UIctrl.updateListItem(updateItem);


                //get total cal 
                const totalCalories = ItemCtrl.getTotalCalorie();


                //add total cal to UI
                UIctrl.showTotalCalories(totalCalories);

                UIctrl.clearEditState();

                e.preventDefault();

            }





        )
        //back button event listerer
        document.querySelector(UIselectors.backBtn).addEventListener('click', UIctrl.clearEditState);


        //delete event listerer
        document.querySelector(UIselectors.deleteBtn).addEventListener('click',
            function itemDeleteSubmit(e) {

                //get current Item 
                const currentItem = ItemCtrl.getCurrentItem();

                //delete from data structure 
                ItemCtrl.deleteItem(currentItem.id);


                // delete item from the UI
                UIctrl.deleteListItem(currentItem.id);

                //get total cal 
                const totalCalories = ItemCtrl.getTotalCalorie();
                //add total cal to UI
                UIctrl.showTotalCalories(totalCalories);

                UIctrl.clearEditState();


                e.preventDefault();

            });

            //clear button event listerer
        document.querySelector(UIselectors.clearBtn).addEventListener('click', 
        function clearAllitemsClick(){
            //delete all items from data sructure
            ItemCtrl.clearAllItems();


            //remove from UI 
            UIctrl.removeItems();

             //get total cal 
             const totalCalories = ItemCtrl.getTotalCalorie();
             //add total cal to UI
             UIctrl.showTotalCalories(totalCalories);


             //hide the uL 

             UIctrl.hideList();

             //clear input 
             UIctrl.clearEditState();

        

        });



    }


    //add item submit




    //public methods 
    return {
        init: function () {
            //clear edit state / or set initial stage to non edit 

            UIctrl.clearEditState();
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


})(ItemCtrl, UIctrl,StorageCtrl)


//initialize app 
Appctrl.init();

