
//code for card design
const addCardName = (cardname) => {
    const card = document.createElement('div');
    card.classList.add('card');

    const htmlData = `<div class="card-header">
                        <textarea name="card-header-textarea" class="card-header-textarea" maxlength="20"></textarea>
                      </div>
                      <button id="add-item-button"><img id="plus-icon" src="img/plus-button-icon.png"/></button>
                      <div class="card-item-container"></div>`

    card.insertAdjacentHTML('afterbegin', htmlData);
    
    const cardContainer = document.querySelector('.card-container');
    cardContainer.appendChild(card); 
    if(cardname != ''){
      const cardHeaderTextarea = card.querySelector('.card-header-textarea');
      cardHeaderTextarea.textContent = cardname;

      const allCardItemRequest = new XMLHttpRequest();
      allCardItemRequest.onreadystatechange = getCardItemAjaxFunction;
      allCardItemRequest.open('GET', 'api/fetch_roadmap_carditem.php?cardName=' + cardname);
      allCardItemRequest.send();

      function getCardItemAjaxFunction () {
        if(allCardItemRequest.readyState===XMLHttpRequest.DONE){
            if(allCardItemRequest.status === 200){
                const cardItems = JSON.parse(allCardItemRequest.responseText);
                cardItems.forEach((cardItem) => {
                  addCardItem(card,cardItem);
                });
            }
        }
      }
    }
}

//code for card-item design
const addCardItem = (card, carditem) => {
  const item = document.createElement('div');
  item.classList.add('item');

  const htmlData = `<textarea name="item-textarea" class="item-textarea" maxlength="20"></textarea>`
  
  item.insertAdjacentHTML('afterbegin', htmlData);

  const cardItemContainer = card.querySelector('.card-item-container');
  cardItemContainer.appendChild(item);

  if(carditem != ''){
    const cardItemTextarea = item.querySelector('.item-textarea');
    cardItemTextarea.textContent = carditem;
  }
}


//Code for creating a new card
const addTaskButton = document.querySelector('.add-task-button');
addTaskButton.addEventListener('click', () => {
       addCardName();
})

//code for creating new card-item inside a card.
document.addEventListener('click', (event)=>{
  if(event.target.id==='plus-icon'){
    const card = event.target.closest('.card');
    const cardHeader = card.querySelector('.card-header-textarea').value;
    
    if(cardHeader!=''){
      addCardItem(card);
    }else{
      alert('please Provide header');
    }
  }
})



document.addEventListener('focusin', (event) => {
  //Code for set heading of every card and storing in database.
  if(event.target.classList.contains('card-header-textarea')){
    const refCard = event.target.closest('.card');
    const cardHeaderTextarea = refCard.querySelector('.card-header-textarea');
    const prevText = cardHeaderTextarea.value;

    cardHeaderTextarea.addEventListener('focusout', ()=> {
      const updatedText = refCard.querySelector('.card-header-textarea').value;
      if(updatedText === '' || prevText === updatedText){
        cardHeaderTextarea.value = prevText;
      }else{
        const storeCardHeadingRequest = new XMLHttpRequest(); 
        storeCardHeadingRequest.onreadystatechange = storeCardHeadingRequestAjaxFunction;
        storeCardHeadingRequest.open('POST', 'api/store_roadmap_card_header.php');
        storeCardHeadingRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        storeCardHeadingRequest.send('PrevText=' + prevText + '&UpdatedText=' + updatedText); 
            
        function storeCardHeadingRequestAjaxFunction () {
          if(storeCardHeadingRequest.readyState===XMLHttpRequest.DONE){
            if(storeCardHeadingRequest.status === 200){
              const response = storeCardHeadingRequest.responseText;
              console.log(response);
              if(response === 'This Heading Already Exist'){
                cardHeaderTextarea.value = prevText;
                alert('This Heading Already Exist');
              }else{
                // alert('Sucessfully stored');
              }
            }
          }
        }
      }
    }, { once: true })
  }

  //Code for calculating dynamic width and set card-item of every card and storing in database with associated card heading.
  if(event.target.classList.contains('item-textarea')){
    const refCard = event.target.closest('.card');
    const cardHeading = refCard.querySelector('.card-header-textarea').value;
    const cardItemTextarea = event.target;
    const prevText = cardItemTextarea.value;

    //Code for Dynamic calculation of item textarea width.
    cardItemTextarea.addEventListener('input', () => {
        const initialWidth = 60;
        const currentValue = cardItemTextarea.value;
        if(currentValue.length > 7) {
          cardItemTextarea.style.width = `${initialWidth + (currentValue.length - 7) * 7}px`;
        }
    });

    //Code for set card-item of every card and storing in database with associated card heading.
    cardItemTextarea.addEventListener('focusout', ()=> {
      const updatedText = cardItemTextarea.value;
      if(updatedText === '' || prevText === updatedText){
        cardItemTextarea.value = prevText;
      }else{
        const storeCardItemRequest = new XMLHttpRequest(); 
        storeCardItemRequest.onreadystatechange = storeCardItemRequestAjaxFunction;
        storeCardItemRequest.open('POST', 'api/store_roadmap_card_item.php');
        storeCardItemRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        storeCardItemRequest.send('PrevText=' + prevText + '&UpdatedText=' + updatedText + '&CardHeading=' + cardHeading); 
            
        function storeCardItemRequestAjaxFunction () {
          if(storeCardItemRequest.readyState===XMLHttpRequest.DONE){
            if(storeCardItemRequest.status === 200){
              const response = storeCardItemRequest.responseText;
              if(response === 'This item Already Exist'){
                cardItemTextarea.value = prevText;
                alert('This item Already Exist');
              }else{
                // alert('Sucessfully stored');
              }
            }
          }
        }
      }
    }, { once: true })
  }
})

window.addEventListener('DOMContentLoaded', () => {
  const allCardNameRequest = new XMLHttpRequest();
  allCardNameRequest.onreadystatechange = getCardNameAjaxFunction;
  allCardNameRequest.open('GET', 'api/fetch_roadmap_cardname.php');
  allCardNameRequest.send();

    function getCardNameAjaxFunction () {
        if(allCardNameRequest.readyState===XMLHttpRequest.DONE){
            if(allCardNameRequest.status === 200){
                const cardNames = JSON.parse(allCardNameRequest.responseText);
                cardNames.forEach((cardName) => {
                  addCardName(cardName);
                });
            }
        }
    }
})