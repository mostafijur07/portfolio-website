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
                                <br/><br/>
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
    }
});

