const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];


//Abrir o modal do carrinho 
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex"
})

//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event){
  if(event.target === cartModal){
    cartModal.style.display ="none"
  }
})

closeModalBtn.addEventListener("click", function(){
  cartModal.style.display ="none"
})

menu.addEventListener("click", function(event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const sizeSelectId = parentButton.getAttribute("data-size-id");
    const sizeSelect = document.getElementById(sizeSelectId);

    if (sizeSelect) {
      const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
      const price = parseFloat(selectedOption.getAttribute("data-price"));
      const size = selectedOption.value;

      addToCart(name, price, size);
    }
  }
});

function addToCart(name, price, size) {
  const existingItem = cart.find(item => item.name === name && item.size === size);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      size,
      quantity: 1,
    });
  }
  
  updateCartModal();
}

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-04", "flex-col");

    // Verifica se há tamanho ou não (pizzas têm tamanho, bebidas não)
    const itemSizeDisplay = item.size ? ` (${item.size})` : ""; 

    const quantityDisplay = item.name.toLowerCase().includes('bebida') ? "1,5L" : item.size || ''; // Altera a forma de exibir

    cartItemElement.innerHTML = ` 
     <div class="flex items-center justify-between">
       <div>
          <p class="font-medium ">${item.name} ${itemSizeDisplay}</p>
          <p>Quantidade: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
       </div>
         <button class="remove-from-cart-btn" data-name="${item.name}" data-size="${item.size}">
           Remover
         </button>
     </div>`;
   
   
    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0); // Atualiza a contagem total
  //cartCounter.innerHTML = cart.length;
}

// Atualizar o contador de itens no botão do carrinho
function updateCartCounter() {
  cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

document.querySelectorAll('.size-select').forEach(select => {
  select.addEventListener('change', function(event) {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const priceElementId = 'price-' + event.target.id.split('-')[1];
    const priceElement = document.getElementById(priceElementId);

    const newPrice = selectedOption.getAttribute('data-price');
    priceElement.textContent = `R$ ${parseFloat(newPrice).toFixed(2)}`;
  });
});

cartItemsContainer.addEventListener("click", function(event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    const size = event.target.getAttribute("data-size");
    removeItemCart(name, size);
  }
});

function removeItemCart(name, size) {
  const index = cart.findIndex(item => item.name === name && item.size === size);

  if (index !== -1) {
    const item = cart[index];
    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

// Selecionar os elementos
const cashPaymentRadio = document.getElementById("cash");
const changeRequiredCheckbox = document.getElementById("change-required");
const changeAmountSection = document.getElementById("change-amount-section");

// Ouvir a mudança na seleção de pagamento
document.querySelectorAll('input[name="payment-method"]').forEach((input) => {
  input.addEventListener("change", function () {
    if (cashPaymentRadio.checked) {
      // Mostrar a opção de troco se "Dinheiro" for selecionado
      document.getElementById("change-section").classList.remove("hidden");
    } else {
      // Esconder a opção de troco se outro método for selecionado
      document.getElementById("change-section").classList.add("hidden");
      document.getElementById("change-amount-section").classList.add("hidden");
    }
  });
});

// Ouvir a mudança no checkbox "Precisa de troco?"
changeRequiredCheckbox.addEventListener("change", function () {
  if (this.checked) {
    // Mostrar o campo para digitar o valor de troco
    changeAmountSection.classList.remove("hidden");
  } else {
    // Esconder o campo de digitação de valor de troco
    changeAmountSection.classList.add("hidden");
  }
});

// Adicionar a lógica no checkout
checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    Toastify({
      text: "Ops, Pizzaria Ruben está fechado no momento!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  if (cart.length === 0) return;

  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  // Verifica o método de pagamento selecionado
  const paymentMethodInputs = document.querySelectorAll('input[name="payment-method"]');
  const paymentWarn = document.getElementById("payment-warn");
  let selectedPaymentMethod = null;

  paymentMethodInputs.forEach((input) => {
    if (input.checked) {
      selectedPaymentMethod = input.value;
    }
  });

  if (!selectedPaymentMethod) {
    paymentWarn.classList.remove("hidden");
    return;
  } else {
    paymentWarn.classList.add("hidden");
  }

  // Se o pagamento for em dinheiro, verifica se precisa de troco
  let changeRequired = "";
  let changeAmount = "";
  if (selectedPaymentMethod === "Dinheiro") {
    if (changeRequiredCheckbox.checked) {
      changeRequired = "Precisa de troco.";
      // Obter o valor do troco, se for preenchido
      const changeAmountInput = document.getElementById("change-amount");
      changeAmount = changeAmountInput.value ? `Troco para: R$ ${parseFloat(changeAmountInput.value).toFixed(2)}` : "";
    } else {
      changeRequired = "Não precisa de troco.";
    }
  }

  // Calcular o total
  let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const cartItems = cart
    .map((item) => {
      let tamanho = "";

      if (item.size && !(item.name.toLowerCase().includes("coca") || item.name.toLowerCase().includes("bebida"))) {
        tamanho = ` |  ${item.size}`;
      }

      return `Produto: ${item.name} | Quantidade: (${item.quantity})${tamanho} | Preço Unitário: R$ ${item.price.toFixed(2)}\n`;
    })
    .join("\n");

  // Obter o horário atual em Manaus (UTC -4)
  const manausTime = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Manaus",
    hour12: false,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  // Adicionar as informações do cliente, horário, pagamento e pedido
  const message = encodeURIComponent(
    `Pizzaria Ruben\n\nInformações do Cliente:\nNome: ${document.getElementById("customer-name").value}\nCelular: ${document.getElementById("customer-phone").value}\nEndereço: ${addressInput.value}\n\n----------------------\n\nForma de Pagamento: ${selectedPaymentMethod}\n${changeRequired}\n${changeAmount}\n----------------------\n\nHorário do Pedido: ${manausTime}\n----------------------\n\n${cartItems}\nTotal: R$ ${total.toFixed(2)}`
  );

  const phone = "5592982128930";
  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  cart = [];
  updateCartModal();
});



// Função para adicionar bebidas ao carrinho (sem tamanho)
document.querySelectorAll(".drink-add-to-cart-btn").forEach(button => {
  button.addEventListener("click", function() {
    const name = button.getAttribute("data-name");
    const price = parseFloat(button.getAttribute("data-price"));

    addDrinkToCart(name, price);  // Chama a função específica para bebidas
  });
});

// Função para adicionar a bebida no carrinho
function addDrinkToCart(name, price) {
  const existingDrink = cart.find(item => item.name === name && !item.size); // Procura sem o tamanho

  if (existingDrink) {
    existingDrink.quantity += 1;  // Aumenta a quantidade se a bebida já existir no carrinho
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal(); 
}




 //Atualiza o carrinho com a bebida

// Função para remover itens do carrinho


cartItemsContainer.addEventListener("click", function(event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
  
     removeDrinkFromCart(name);

    }
  });

function removeItemCart(name){
  const index = cart.findIndex(item => item.name === name);

  if(index !== -1){
    const item = cart[index];
    if(item.quantity > 1){
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();

  }


}



addressInput.addEventListener("input", function(event){
  let inputValue = event.target.value;

  if(inputValue !== ""){
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }
})
  // Função para remover uma bebida do carrinho


  //function removeDrinkFromCart(name) {
   //const index = cart.findIndex(item => item.name === name && item.size === size);


  //if (index !== -1) {
    //const item = cart[index];
    //if (item.quantity > 1) {
      //item.quantity -= 1;
    //} else {
     // cart.splice(index, 1);
    //}
    //updateCartModal();
  //}
//}



//Verificar a hora e manipular o card e horário

 function checkRestaurantOpen(){
  const data = new Date();
  const hora = data.getHours();
  return hora  >= 15 && hora < 24; 
  //true = restaurante está aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600")
}else{
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")
}