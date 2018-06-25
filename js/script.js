$( document ).ready(function(){

  var currentPage = 1;
  var topCoin = '';
  var cryptoCurrencies = 0;


/* initialise data
*
* */
  function init(limit){

    var marketTotal = 0;
    $.getJSON("js/crypto.json", function(json) { //retrieve data
      var body = document.querySelector('.table-container')
      body.innerHTML = '';
      var header = true;
      if(json){
        var coinData = json
          var page = document.createElement('div') //create table page
          var pageNum = 0
          topCoin = coinData[0]['name']  //top coin query
          cryptoCurrencies = coinData.length
          for (var i in coinData){  //object iterate
            marketTotal += parseInt(coinData[i]['market_cap_usd']) //count market
            var singleCoin = coinData[i]
            var rmArr = ['max_supply', 'id', 'price_btc', 'total_supply', 'percent_change_1h']
            rmArr.forEach( function(rm){
              singleCoin = removeProp(singleCoin, rm) //remove unneeded properties
            })
            singleCoin = formatObj(singleCoin) //format coin obj properties
            if(header){
                appendHeaders(singleCoin) //add table headers if required
            }
            if (limit == 0){
              page.append(appendCoin(singleCoin)) //if show all, add all to page
              document.querySelector('.table-container').append(page)
            }
            else{
              if ( i % limit == 0){ //if there is a page limit, use modulus for client side pagination
                page = document.createElement('div')
                pageNum++

                page.classList.add('table-page')
                if (pageNum == 1){
                  page.classList.add('active')
                }

                page.setAttribute('page_value', pageNum.toString())
                page.append(appendCoin(singleCoin))
                document.querySelector('.table-container').append(page)
              }
              else{

                page.append(appendCoin(singleCoin))
              }

            }
            header = false;
          }
      }

      else{
        noResults()
      }

      appendStatistics('Top Coin: \n' + topCoin, 'Market Worth: \n $' + numberWithCommas(marketTotal), 'Total Coins: \n ' + cryptoCurrencies)
    });

    setTimeout(function(){
      var page_amount = parseInt(document.querySelectorAll('.table-page').length) == 0 ? 1 : parseInt(document.querySelectorAll('.table-page').length)
      document.querySelector('.page-number').innerText = 'Page ' + currentPage.toString()+ ' of '+ page_amount;
    },100)

  }

  /* append statistics to header
*
* */
  function appendStatistics(best_coin, total_market, total_coins){
    document.querySelector('.table-item.best_coin').innerText = best_coin
    document.querySelector('.table-item.total_market').innerText = total_market
    document.querySelector('.table-item.total_coins').innerText = total_coins
  }


  /* add commas per thousand
*
* */
  function numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /* remove floating points for certain numbers
*
* */
  function removeDecimal(number){
   return Math.round(number)
  }

  /* round currency to two floating point
*
* */
  function twoFloat(number){
   return parseFloat(Math.round(number * 100) / 100).toFixed(2)
  }

  /* format object properties i.e UNIX Timestamp to GMT
*
* */
  function formatObj(obj){
    for (var x in obj){
      if (obj.hasOwnProperty(x)){
        switch (x){
          case 'price_usd':
            obj[x] = '$'+numberWithCommas(twoFloat(obj[x]));
            break;
          case 'market_cap_usd':
          case '24h_volume_usd':
            obj[x] = '$' + numberWithCommas(removeDecimal(obj[x]));
            break;
          case 'percent_change_24h':
          case 'percent_change_7d': obj[x] = obj[x] + '%';
          break;
          case 'available_supply':
            obj[x] = numberWithCommas(removeDecimal(obj[x])) + ' ' +obj['symbol'].toString()
            break;
          case 'last_updated':
            var d = new Date((obj[x]*1000));
            obj[x] = ('0' + d.getDate()).slice(-2) + "/" +  ('0' + (d.getMonth()+1)).slice(-2) + "/" + d.getFullYear();
            var s = d.getSeconds().toString().length == 1 ? d.getSeconds() + '0': d.getSeconds();
            var t = d.getHours()+':'+d.getMinutes()+ '.' + s;
            obj[x] += ' | ' +t;
            break;

        }
      }
    }
    return obj
  }

  /* remove un-needed properties function
*
* */
  function removeProp(obj, prop){
    if (obj[prop]){
      delete obj[prop.toString()]
    }
    if (obj[prop] == undefined){
      delete obj[prop.toString()]
    }
    return obj
  }

  function noResults(){
    var body = document.querySelector('.table-container')
    var span = document.createElement('span')
    span.innerText = "Looks like we couldn't find any coins :(";
    body.append(span)
  }

  /* returns coin table from object
*
* */
  function appendCoin(coinData){
    var tr = document.createElement('ul')
    for (var key in coinData){
      if (key == 'symbol'){
        continue;
      }
      else{
        var td = document.createElement('li')
        var span = document.createElement('span')
        span.innerText  = coinData[key]
        td.append(span)
        if(key.toString().indexOf('_usd') !== -1){
          key=  key.replace('_usd', '')
        }
        if(key.toString().indexOf('percent_') !== -1){
          key=  key.replace('percent_', '')
        }
        td.setAttribute('key_value', key)

        tr.append(td)
      }

    }
    return tr
  }

  /* adds keys as headers
*
* */
  function appendHeaders(data){
    var body = document.querySelector('.table-container')
    var table = document.createElement('div')
    var tr = document.createElement('ul')
    tr.classList.add('table-header')
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        if (key == 'symbol'){
          continue;
        }
        else{
          if(key.toString().indexOf('_usd') !== -1){
            key=  key.replace('_usd', '')
          }
          if(key.toString().indexOf('percent_') !== -1){
            key=  key.replace('percent_', '')
          }

          var th = document.createElement('li');

          th.setAttribute('key_value', key.toString());
          var text = key.toString().replace(/_/g, ' ');
          var span = document.createElement('span')
          span.innerText  = text;
          th.append(span)
          tr.append(th);

          body.append(tr)
        }

      }
    }

    listenTableOrder()
  }


  /* results per page
*
* */
  function listenPagination(){
    var select = document.querySelector('select')
    select.addEventListener('change', function(){
      init(select.value)
    })
  }


/* lock header on scroll
*
* */
function listenHeaderLock(){
$(window).scroll(function (event) {
  var scroll = $(window).scrollTop();
  if (scroll >= 260){
    $('ul:first-of-type').addClass('fixed')
  }
  if (scroll <= 210){
    if ($('ul:first-of-type').hasClass('fixed')){

      $('ul:first-of-type').removeClass('fixed')
    }
  }
});
}

  /* page selection
  *
  * */
function listenPageselect()  {
document.querySelectorAll('.btn-page').forEach( function(btn){
  btn.addEventListener('click', function(evt){
    var action = parseInt(evt.target.getAttribute('action_value'))
    handlePageselect(action)
  })
})
}

  /* page selection
  *
  * */
function handlePageselect(direction){

  var tablePages = document.querySelectorAll('.table-page')
  if (direction==1){
    if(currentPage >= 1 && currentPage < tablePages.length){
      currentPage++
    }
  }
  if (direction == -1){
    if(currentPage > 1 && currentPage <= tablePages.length){
      currentPage--
    }
  }
  tablePages.forEach( function(pge){
    if (parseInt(pge.getAttribute('page_value')) != currentPage){
      if (pge.classList.contains('active')){
        pge.classList.remove('active')
      }
    }
    else {
      pge.classList.add('active')
    }
  })
  document.querySelector('.page-number').innerText = 'Page ' + currentPage.toString()+ ' of '+ tablePages.length;
}

init(24, false)
listenPagination()
listenHeaderLock()
listenPageselect()
//listenFeedback()

})



/* feedback val client side
*
*
function listenFeedback() {
document.querySelector('button[type="submit"]').addEventListener('click', function (evt) {
var check = document.querySelectorAll('form input, textarea')
var is_empty = false;
check.forEach(function (field) {
  if (!field.value) {
    is_empty = true
  }
  console.log(is_empty)
  if (!is_empty) {
    evt.target.removeAttribute('disabled')
    evt.target.click()
  }
})

})
}*/

/* table order
*
*
function listenTableOrder(){
  var headers = document.querySelectorAll('th')
  headers.forEach(function(ret){
  ret.addEventListener('click', function(evt){
    headers.forEach(function(rm){
      if ($(rm).hasClass('is-selected')){
        $(rm).removeClass('is-selected')
      }
    })
    $(evt.target).addClass('is-selected')
  })
})
}
*/


