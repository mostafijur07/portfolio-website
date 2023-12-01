let flag =true;

const addListItem = (listCard, listitem, itemStatus) => {
    if(itemStatus === 'complete'){
        const completeList = listCard.querySelector('.complete-list');
        const listItemCard = document.createElement('div');
        listItemCard.classList.add('c-list-item-card');
        listItemCard.innerHTML = `${listitem}`;

        completeList.appendChild(listItemCard); 
    }else{
        const completeList = listCard.querySelector('.incomplete-list');
        const listItemCard = document.createElement('div');
        listItemCard.classList.add('in-list-item-card');
        listItemCard.innerHTML = `${listitem}`;

        completeList.appendChild(listItemCard); 
    }
}


const addListCard = (listName) => {
    const listContainer = document.querySelector('.list-container');
    const listCard = document.createElement('div');
    listCard.classList.add('list-card');

    const htmlData = `<div class="list-header">
                        <h1>${listName}</h1>
                        <div class="button-container">
                            <button id="add-button">Add</button>
                            <button id="delete-button">delete</button>
                        </div>
                      </div>
                      <div class="complete-list"></div>
                      <div class="incomplete-list"></div>`
    
    listCard.insertAdjacentHTML('afterbegin',htmlData);
    listContainer.appendChild(listCard);

    const alllistItemRequest = new XMLHttpRequest();
    alllistItemRequest.onreadystatechange = getListItemAjaxFunction;
    alllistItemRequest.open('GET', 'api/listitem_fetch.php?listname=' + listName);
    alllistItemRequest.send();

    function getListItemAjaxFunction () {
        if(alllistItemRequest.readyState===XMLHttpRequest.DONE){
            if(alllistItemRequest.status === 200){
                const listitemdata = JSON.parse(alllistItemRequest.responseText);
                listitemdata.forEach((itemdata) => {
                    addListItem(listCard, itemdata.listitem, itemdata.itemstatus);
                });
            }
        }
    }
}

const createButton = document.querySelector('#create-button');
createButton.addEventListener('click', () => {
    if(flag){
        flag=false;
        const fullScreen = document.querySelector('.fullscreen');
        const createPopupCard = document.createElement('div');
        createPopupCard.classList.add('create-popup-card');

        const htmlData = `<button id="create-close-button"><i class="fas fa-times"></i></button>
                        <h1>Select List Name</h1>
                        <br/>
                        <form>
                            <select name="listname">
                                <option value="A_CODING">CODING</OPTION>
                                <option value="B_WEB DEVELOPMENT">WEB DEVELOPMENT</OPTION>
                                <option value="C_M.E 1ST SEM">M.E 1ST SEM</OPTION>
                            </select>
                        </form>
                        <button id="create-submit-button">submit</button>`
    
        createPopupCard.insertAdjacentHTML('afterbegin', htmlData);
        fullScreen.appendChild(createPopupCard);
        createPopupCard.style.display = "flex";

        const closeButton = createPopupCard.querySelector('#create-close-button');
        closeButton.addEventListener('click', () => {
            createPopupCard.style.display = "none";
            flag=true;
        });

        const submitButton = createPopupCard.querySelector('#create-submit-button');
        submitButton.addEventListener('click', () => {
            const selectArea = createPopupCard.querySelector('select');
            const listName = selectArea.value;
            createPopupCard.style.display = "none";
            flag=true;

            const addNewListCardRequest = new XMLHttpRequest();
            addNewListCardRequest.onreadystatechange = postAjaxFunction;
            addNewListCardRequest.open('POST', 'api/listname_store.php');
            addNewListCardRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            addNewListCardRequest.send('listname=' + listName);
            
            function postAjaxFunction () {
                if(addNewListCardRequest.readyState===XMLHttpRequest.DONE){
                    if(addNewListCardRequest.status === 200){
                        const response = addNewListCardRequest.responseText;
                        if(response === 'list already selected'){
                            alert('list already selected');
                        }else{
                            addListCard(listName);
                        }
                    }
                }
            }
        })
    }
})


window.addEventListener('DOMContentLoaded', () => {
    const allListCardRequest = new XMLHttpRequest();
    allListCardRequest.onreadystatechange = getAjaxFunction;
    allListCardRequest.open('GET', 'api/listname_fetch.php');
    allListCardRequest.send();

    function getAjaxFunction () {
        if(allListCardRequest.readyState===XMLHttpRequest.DONE){
            if(allListCardRequest.status === 200){
                const listNames = JSON.parse(allListCardRequest.responseText);
                listNames.forEach((listName) => {
                    addListCard(listName);
                });
            }
        }
    }
})

document.addEventListener('click', (event) => {
    if (event.target.id === 'delete-button') {
        if(flag){
            flag=false;
            const listCard = event.target.closest('.list-card');
            const h1Element = listCard.querySelector('h1');
            const listname = h1Element.innerHTML;
        
            if (confirm(`Are you sure you want to delete the list "${listname}"?`)) {
                listCard.remove();
                const deleteListCardRequest = new XMLHttpRequest();
                deleteListCardRequest.onreadystatechange = postListDeleteAjaxFunction;
                deleteListCardRequest.open('POST', 'api/listdelete.php');
                deleteListCardRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                deleteListCardRequest.send('listname=' + listname);

                function postListDeleteAjaxFunction () {
                    if(deleteListCardRequest.readyState===XMLHttpRequest.DONE){
                        if(deleteListCardRequest.status === 200){
                            const response = deleteListCardRequest.responseText;
                            alert(response);
                        }
                    }
                }
            }
            flag=true;
        }
    }else if(event.target.id === 'add-button'){
        if(flag){
            flag=false;
            const fullScreen = document.querySelector('.fullscreen');
            const listPopupCard = document.createElement('div');
            listPopupCard.classList.add('list-popup-card');

            const htmlData = `<button id="list-close-button"><i class="fas fa-times"></i></button>
                            <h1>Select Name</h1>  
                            <br/>           
                            <form id="list-form">
                                <textarea name="list-item" maxlength="20"></textarea>
                                <br/>
                                <input type="radio" name="status" value="complete"> complete
                                <input type="radio" name="status" value="incomplete"> incomplete
                                <br/>
                            </form>
                            <button id="list-submit-button">submit</button>`

            listPopupCard.insertAdjacentHTML('afterbegin', htmlData);
            fullScreen.appendChild(listPopupCard);
            listPopupCard.style.display = "flex";

            const closeButton = listPopupCard.querySelector('#list-close-button');
            closeButton.addEventListener('click', () => {
                listPopupCard.style.display = "none";
                flag=true;
            });

            const submitButton = listPopupCard.querySelector('#list-submit-button');
            submitButton.addEventListener('click', () => {
            const textArea = listPopupCard.querySelector('textarea');
            const listItem = textArea.value;
            const inputValue = listPopupCard.querySelector('input:checked');
            if(listItem === "" || inputValue === null){
                alert('please fill all field');
            }else{
                const itemStatus = inputValue.value;
                const trimListItem = listItem.trim();
                const listCard = event.target.closest('.list-card');
                const h1Element = listCard.querySelector('h1');
                const listName = h1Element.innerHTML;
                listPopupCard.style.display = "none";
                flag=true;

                const addNewListItemRequest = new XMLHttpRequest();
                addNewListItemRequest.onreadystatechange = postListItemAjaxFunction;
                addNewListItemRequest.open('POST', 'api/listitem_store.php');
                addNewListItemRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                addNewListItemRequest.send('listitem=' + trimListItem + '&listname=' + listName + '&itemstatus=' + itemStatus );
            
                function postListItemAjaxFunction () {
                    if(addNewListItemRequest.readyState===XMLHttpRequest.DONE){
                        if(addNewListItemRequest.status === 200){
                            const response = addNewListItemRequest.responseText;
                            if(response === 'Item already exist'){
                                alert('Item already exist');
                            }else{
                                alert('Item added sucessfully');
                                addListItem(listCard,trimListItem,itemStatus);
                            }
                        }
                    }
                }
            }
        })
        }
    } else if(event.target.classList.contains('c-list-item-card') || event.target.classList.contains('in-list-item-card')){
        if(flag){
            flag=false;
            const fullScreen = document.querySelector('.fullscreen');
            const listItemPopupCard = document.createElement('div');
            listItemPopupCard.classList.add('listitem-popup-card');

            const htmlData = `<button id="listitem-close-button"><i class="fas fa-times"></i></button>
                            <h1>Change Status</h1>  
                            <br/>           
                            <button id="listitem-changestatus-button">change</button>
                            <br/>
                            <h1>Delete item</h1>
                            <br/>
                            <button id="listitem-delete-button">delete</button>`

            listItemPopupCard.insertAdjacentHTML('afterbegin', htmlData);
            fullScreen.appendChild(listItemPopupCard);

            listItemPopupCard.style.display = "flex";

            const closeButton = listItemPopupCard.querySelector('#listitem-close-button');
            closeButton.addEventListener('click', () => {
                listItemPopupCard.style.display = "none";
                flag=true;
            });

            const changestatusButton = listItemPopupCard.querySelector('#listitem-changestatus-button');
            changestatusButton.addEventListener('click', () => {
                const listCard = event.target.closest('.list-card');
                let listitem, itemName, newItemStatus;
                if(event.target.classList.contains('c-list-item-card')){
                    listitem = event.target.closest('.c-list-item-card');
                    itemName = event.target.innerHTML;
                    newItemStatus = 'incomplete';
                }else{
                    listitem = event.target.closest('.in-list-item-card');
                    itemName = event.target.innerHTML;
                    newItemStatus = 'complete';
                }

                listItemPopupCard.style.display = "none";
                flag=true;

                const updateListItemRequest = new XMLHttpRequest();
                updateListItemRequest.onreadystatechange = postUpdateListItemAjaxFunction;
                updateListItemRequest.open('POST', 'api/listitem_update.php');
                updateListItemRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                updateListItemRequest.send('itemname=' + itemName + '&newitemstatus=' + newItemStatus);
            
                function postUpdateListItemAjaxFunction () {
                    if(updateListItemRequest.readyState===XMLHttpRequest.DONE){
                        if(updateListItemRequest.status === 200){
                            const response = updateListItemRequest.responseText;
                            listitem.remove();
                            alert(response);
                            addListItem(listCard,itemName,newItemStatus);
                        }
                    }
                }
            })

            const listitemDeleteButton = listItemPopupCard.querySelector('#listitem-delete-button');
            listitemDeleteButton.addEventListener('click', () => {
                let listitem, itemName;
                if(event.target.classList.contains('c-list-item-card')){
                    listitem = event.target.closest('.c-list-item-card');
                    itemName = event.target.innerHTML;
                }else{
                    listitem = event.target.closest('.in-list-item-card');
                    itemName = event.target.innerHTML;
                }

                listItemPopupCard.style.display = "none";
                flag=true;

                const deleteListItemRequest = new XMLHttpRequest();
                deleteListItemRequest.onreadystatechange = postDeleteListItemAjaxFunction;
                deleteListItemRequest.open('POST', 'api/listitem_delete.php');
                deleteListItemRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                deleteListItemRequest.send('itemname=' + itemName);
            
                function postDeleteListItemAjaxFunction () {
                    if(deleteListItemRequest.readyState===XMLHttpRequest.DONE){
                        if(deleteListItemRequest.status === 200){
                            const response = deleteListItemRequest.responseText;
                            listitem.remove();
                            alert(response);
                        }
                    }
                }
            })
        }
    }
});

