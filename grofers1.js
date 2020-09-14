const puppeteer = require("puppeteer");
//const chalk = require("chalk");
var fs = require("fs");


//puppeteer.launch().then(async browser => {

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log("hello");
  await page.goto("https://grofers.com/cn/grocery-staples/cid/16");
  

  await autoScroll(page);

  page.evaluate(async () => {
    console.log("hello");
    let products = [];
    const ele = document.getElementsByClassName(`plp-product`);
    console.log(ele.length);

    for (let i of ele) {
      if (i.children[4].children.item(0) != null) {
        if (i.children[4].children.item(0).className == "") {
          products.push(i.children[3].attributes["title"].value);
          products.push(i.children[0].innerText);
          products.push("quantity-> " + i.children.item(4).innerText);
          products.push("price-> " + i.children[5].children[0].children[0].children[0].innerText);
          console.log(ele.length);
        }
      }
      else {
        products.push(i.children[1].attributes["title"].value);
        //products.push(i.children[0].innerText);
        products.push("quantity-> " + i.children[2].innerText);
        products.push("price-> " + i.children[3].children[0].innerText);
      }
    }

    //browser.close();
    return products;

    /*fs.writeFile("details4.txt", JSON.stringify(products), function (err) {
      if (err) throw err;
      console.log(products.length);
      console.log("Saved!");
    });*/
    //return resolve(products);

  }).then((result) => {
    browser.close();
    console.log("Saved!");
    console.log(result.length);
    fs.writeFileSync('details7.txt', result.join('\n') + '\n');
  }).catch((err) => { console.log(err) });
  //browser.close();
})();



async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}