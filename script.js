let randomCard = document.querySelector('.wrp-card'),
    topTenMagnaCards = document.querySelector('.top-ten'),
    slickSliderWrp = document.querySelector('.swiper-wrapper'),
    randomMangaBtn = document.querySelectorAll('.randomManga'),
    refreshSlider = document.querySelector('.refreshSlider');

const mySwiper = document.querySelector('.mySwiper');

let topTenMangaApi = 'https://api.jikan.moe/v4/top/manga';
let randomMagnaApi = 'https://api.jikan.moe/v4/random/manga';

function fetchDate(el , apiType ,classDeleted){
    fetch(apiType)
    .then(res => res.json())
    .then(res => createRandomElementCard(res , el , classDeleted))
}
function createRandomElementCard(data , cardItem , classDeleted){

    let bodyItem = document.createElement("div");
    bodyItem.classList.add('conent-card');

    if (cardItem === topTenMagnaCards){

        for(let i = 0; i< 10; i++){
            createElementAllItem(data.data[i].url , data.data[i].images.webp.image_url,
                data.data[i].title,date([
                    {
                        day: data.data[i].published.prop.from.day,
                        month: data.data[i].published.prop.from.month,
                        year: data.data[i].published.prop.from.year
                    },
                    {
                        day:data.data[i].published.prop.to.day,
                        month:data.data[i].published.prop.to.month,
                        year:data.data[i].published.prop.to.year
                    },
                ]),checkRank(data.data[i].rank),checkDescr(data.data[i].synopsis), bodyItem);
        };       
        cardItem.append(bodyItem);
    }else if(cardItem === randomCard){
        let imgUrl =  data.data.images.webp.image_url,
            titleName =  data.data.title,
            buttonLink =  data.data.url,
            descriptions =  data.data.synopsis,
            ranked =  data.data.rank,
            dated = [
                {
                    day: data.data.published.prop.from.day,
                    month: data.data.published.prop.from.month,
                    year: data.data.published.prop.from.year
                },
                {
                    day:data.data.published.prop.to.day,
                    month:data.data.published.prop.to.month,
                    year:data.data.published.prop.to.year
                },
            ];
            let dates = date(dated);
            let descr = checkDescr(descriptions);
            let rank = checkRank(ranked);

        createElementAllItem(buttonLink, imgUrl, titleName , dates, rank, descr , bodyItem ,classDeleted);
        cardItem.append(bodyItem);
    }else if(cardItem === slickSliderWrp){
        let containerSwiperItem = document.createElement('div');
        containerSwiperItem.classList.add('swiper-slide');

        let imgUrl =  data.data.images.webp.image_url,
        titleName =  data.data.title,
        buttonLink =  data.data.url,
        descriptions =  data.data.synopsis,
        ranked =  data.data.rank,
        dated = [
            {
                day: data.data.published.prop.from.day,
                month: data.data.published.prop.from.month,
                year: data.data.published.prop.from.year
            },
            {
                day:data.data.published.prop.to.day,
                month:data.data.published.prop.to.month,
                year:data.data.published.prop.to.year
            },
        ];
        let dates = date(dated);
        let descr = checkDescr(descriptions);
        let rank = checkRank(ranked);
        
        
        createElementAllItem(buttonLink, imgUrl, titleName , dates, rank, descr , containerSwiperItem );
        cardItem.append(containerSwiperItem);
        


    }

    function date(data){
        let strStart = ``;
        let strEnd = ``;
        let splitStr = ``;
        if(data[1].day === null || data[0].day === null){
            splitStr = 'uknown'
        }else{
            data[0].day === null ? strStart = "Ongoing" : strStart = `${data[0].day}.${data[0].month}.${data[0].year}`;
            data[1].day === null ? strEnd = "Ongoing" : strEnd = `${data[1].day}.${data[1].month}.${data[1].year}`;
        }
        splitStr.length < 1 ? splitStr = `${strStart} - ${strEnd}`: null;
        return splitStr
    }
    function checkDescr(descr){
        let str = ``;
        descr === null ? str = "No Descriptions" : str = descr
    
        function limitStr(str, n, symb) {
            if (!n && !symb) return str;
            symb = symb || '...';
            return str.substr(0, n - symb.length) + symb;
        }
        if(str.length > 120){
            str = limitStr(str , 120);
        }
    
        return str
    }
    function checkRank(rank){
        let str = ``;
        rank === null ? str = "No Rank" : str = rank
        return str
    }
    function createElementAllItem(buttonLink, imgUrl, titleName , dates, rank, descr ,wrapperBlock ,classDeleted){
        let newClassForDel = classDeleted;
        if(!classDeleted){
            newClassForDel = '';
        }
        wrapperBlock.innerHTML += `
        <div class="card-item ${newClassForDel} ">
            <div class="top">
                <a target="blank" href="${buttonLink}"><img src='${imgUrl}' class="card-img-top" alt="img"></a>
            </div>
            <div class="bot">
                <div class="card-body">
                    <h5 class="card-title">${titleName}</h5>
                    <p class="card-text"><small class="text-muted">Data : ${dates}</small></p>
                    <p class="card-text">Rank : ${rank}</p>
                    <p class="card-text">${descr}</p>
                    <a target="blank" href="${buttonLink}" class="buttonCard btn btn-primary">Read Now</a>
                </div>
            </div>
        </div>
    `
    
    }

}

randomMangaBtn.forEach(el => {
    el.addEventListener('click' , (e) => {
        let classDeleted = 'deleted';
        
        window.scrollTo({
        top: 780,
        behavior: 'smooth',
        });

        e.preventDefault();
        fetchDate(randomCard , randomMagnaApi , classDeleted);
    
        let allCardsDublicate = document.querySelectorAll('.deleted');
         allCardsDublicate.forEach((item , id) =>  id <= 1 ? item.parentElement.remove() : null)
    })
})



function createTopTenCards(){
    fetchDate(topTenMagnaCards , topTenMangaApi);
}
createTopTenCards();

refreshSlider.addEventListener('click' , (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
        });
    document.querySelectorAll('.swiper-slide').forEach(el => {
        el.remove();
    })

    sliderItems();
    addLoadingSpinner();
    loadingSpinner();
})


function sliderItems(){
    const interval = setInterval(createSliderItems, 100);
    
    function createSliderItems(){
        fetchDate(slickSliderWrp , randomMagnaApi);
    }

    let ourCardsSlider = document.querySelectorAll('.swiper-slide');
    
    setTimeout(() => {
        clearInterval(interval);
    }, 3000);
}
sliderItems();

function loadingSpinner(){
    setTimeout(function offSninner(){
        document.querySelector('.store').classList.add('unactive');
        document.querySelector('body').classList.remove('block');
        document.querySelector('.skeleton').classList.add('unactive');

    },3000);
}
function addLoadingSpinner(){
    document.querySelector('.store').classList.remove('unactive');
    document.querySelector('body').classList.add('block');
    document.querySelector('.skeleton').classList.remove('unactive');
}
loadingSpinner();










