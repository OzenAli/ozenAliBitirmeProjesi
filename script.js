let thsirtList = [], 
    basketList = []

   
const toggleModal = () =>{
    const basketModalEl = document.querySelector(".basket_model")
    basketModalEl.classList.toggle("active")
}

const getThsirts = () => {
    fetch("./urunler.json")
    .then(res => res.json())
    .then((thsirts) => thsirtList = thsirts)
}

getThsirts()

const createThsirtItemsHtml = () =>{
    const thsirtListEl = document.querySelector(".thsirt_list")
    let thsirtListHtml = ""
    thsirtList.forEach(thsirt =>{
        thsirtListHtml += `
        <div class="col-md-6">
            <div class="urunBirim">
                <div>
                    <img class="img-fluid shadow" src="${thsirt.resim}" height="250px"
                        width="150px" alt="">
                </div>
                <div style="width: 150px;">
                    <div>
                        <span class="urun_Adi">${thsirt.isim}</span><br>
                        <span class="urun_Aciklama">${thsirt.aciklama}</span>
                            <div style="margin-top: 20px;">
                                <span style="font-weight: bold;">${thsirt.fiyat}₺</span>
                            </div>
                        <button class="btn_ekle" onclick="addThsirtToBasket(${thsirt.id})" style="margin-top: 20px;">Sepete Ekle</button>
                    </div>
                </div>
            </div>
        </div>`
    })

    thsirtListEl.innerHTML = thsirtListHtml
    
    // console.log(thsirtListHtml)
}

const listBasketItems = () => {
   localStorage.setItem("basketList", JSON.stringify(basketList))
   const basketListEl = document.querySelector(".basket_list")
   const totalPriceEl = document.querySelector(".total_price")

    let basketListHtml = ""
    let totalPrice = 0
    basketList.forEach(item => {
        totalPrice += item.product.fiyat * item.quantity
        basketListHtml += `<li class="basket_item">
        <img style="box-shadow: 0 0 3px 0 black;" class="basket_item" src="${item.product.resim}" width="100" height="150">
        <div class="basket_item-info">
            <h3 class="thsirt_name">${item.product.isim}</h3>
            <span class="thsirt_ucreti">${item.product.fiyat}₺</span><br>
            <span class="thsirt_remove" style="cursor:pointer" onclick="removeItemToBasket(${item.product.id})">Remove</span>
        </div>
        <div class="thsirt_count">
            <span class="decrease" onclick="decreaseItemToBasket(${item.product.id})">-</span>
            <span>${item.quantity}</span>
            <span class="increase" onclick="increaseItemToBasket(${item.product.id})">+</span>
        </div>
    </li>`
    })

    basketListEl.innerHTML = basketListHtml ? basketListHtml : `<li class="basket_item">
    Herhangi Bir Ürün Bulunamadı.
</li>`
    totalPriceEl.innerHTML = totalPrice > 0 ? "Toplam : " + totalPrice+"₺" : null
}

const addThsirtToBasket = (thsirtId) => {
   let findedThsirt = thsirtList.find(
    thsirt => thsirt.id == thsirtId)
   if(findedThsirt){
    const basketAllreadyIndex = basketList.findIndex(basket => basket.product.id == thsirtId)
    if(basketAllreadyIndex == -1){
        let addedItem = {quantity: 1, product: findedThsirt}
        basketList.push(addedItem)
    }else{
        if(basketList[basketAllreadyIndex].quantity < basketList[basketAllreadyIndex].product.stok)
        basketList[basketAllreadyIndex].quantity += 1
        else alert("Yeterli Stok Bulunamıyor!!!")
    }

    listBasketItems()
    
//    console.log(basketList)  
   }
    
}

const removeItemToBasket = (thsirtId) => {
  const findedIndex = basketList.findIndex(basket => basket.product.id == thsirtId)
  if(findedIndex != -1){
    basketList.splice(findedIndex,1)
  }
  listBasketItems()
}

const decreaseItemToBasket = (thsirtId) => {
    const findedIndex = basketList.findIndex(basket => basket.product.id == thsirtId)
    if(findedIndex != -1){
        if(basketList[findedIndex].quantity != 1)
        basketList[findedIndex].quantity -= 1
    else removeItemToBasket(thsirtId)
    listBasketItems()
}
}

const increaseItemToBasket = (thsirtId) => {
    const findedIndex = basketList.findIndex(basket => basket.product.id == thsirtId)
    if(findedIndex != -1){
        if(basketList[findedIndex].quantity != basketList[findedIndex].product.stok)
        basketList[findedIndex].quantity += 1
    else alert("Yeterli Stok Bulunamıyor!!!")
    listBasketItems()
}
}

const THSIRT_TYPES = {
    all : "Tümü",
    erkek : "Erkek Thsirt",
    kadin : "Kadın Thsirt",
    unisex : "Unisex Thsirt"
}

const createThsirtTypesHtml = () => {
    const filterEl = document.querySelector(".filter")
    let filterHtml = ""
    let filterTypes = ["all"]
    thsirtList.forEach(thsirt => {
        if(filterTypes.findIndex(filter => filter == thsirt.cinsiyet) == -1) filterTypes.push(thsirt.cinsiyet)
    })

    filterTypes.forEach((type , index) => {
        filterHtml += `<li class="${index == 0  ? "active" : null}" onclick="filterThsirts(this)" data-type="${type}">${THSIRT_TYPES[type] || type}</li>`
    })

    filterEl.innerHTML = filterHtml
}

const filterThsirts = (filterEl) => {
    document.querySelector(".filter .active").classList.remove("active")
    filterEl.classList.add("active")
    let thsirtType = filterEl.dataset.type
    getThsirts()
    if(thsirtType != "all") 
    thsirtList = thsirtList.filter(thsirt => thsirt.cinsiyet == thsirtType)
    createThsirtItemsHtml()
}

if(localStorage.getItem("basketList") ){
    basketList = JSON.parse(localStorage.getItem("basketList"))
    listBasketItems()
}

const odemeTiklandi = () => {
    alert("Bir sorun oluştu!!! Lütfen daha sonra tekrar deneyiniz...")
}

setTimeout(() => {
    createThsirtItemsHtml()
    createThsirtTypesHtml()
}, 100);

// toastr.info('Are you the 6 fingered man?')