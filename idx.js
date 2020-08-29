const puppeteer = require("puppeteer");
//const chalk = require("chalk");
var fs = require("fs");


//puppeteer.launch().then(async browser => {

(async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log("hello");

  await page.goto("https://www.jiomart.com/c/groceries/staples/13");

  /*var ele;
  await page.evaluate(() => {
    ele = document.getElementsByClassName(`cat-submenu-level1`);
  })*/


  await page.evaluate(() => {
    for (let i of document.getElementsByClassName(`cat-submenu-level1`)) {

      (async () => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage()
        page.setViewport({ width: 1280, height: 926 });
        var cc = i.attributes["href"].value;
        await page.goto(cc);

        products.push('\n');
        products.push(i.innerText);

        console.log(ele.length);


        await page.exposeFunction("loadAllPages", loadAllPages);
        await page.exposeFunction("evaluate", evaluate);
        await page.exposeFunction("logger", logger);

        loadAllPages();

        // Click all next buttons and evaluate items
        function loadAllPages() {
          setTimeout(() => {
            console.log(page.url());
            evaluate();
            page.evaluate(() => {
              if (!(document.querySelector(".next") == null)) {
                document.querySelector(".next > a").click();
                loadAllPages();
              } else {
                logger("Done!");
              }
            }).catch((err) => console.log(err))
          }, 3000)
        }

        function logger(data) {
          console.log(data);
        }

        function evaluate() {
          page.evaluate(() => {

            var data = []

            var items = document.querySelectorAll('.product-list .col-md-3');

            for (let item of items) {
              var name = "NaN"
              var brand = "NaN"
              var price = "NaN"
              var oldPrice = "NaN"
              var sodexo = "NaN"
              var offer = "NaN"

              if (!(item.querySelector(".clsgetname") == null)) {
                name = item.querySelector(".clsgetname").innerText;
              }
              if (!(item.querySelector(".drug-varients") == null)) {
                brand = item.querySelector(".drug-varients").innerText;
              }
              if (!(item.querySelector(".price-box #price") == null)) {
                oldPrice = item.querySelector(".price-box #price").innerText;
              }
              if (!(item.querySelector(".price-box #final_price") == null)) {
                price = item.querySelector(".price-box #final_price").innerText;
              }
              if (!(item.querySelector(".price-box .sodexo_icon") == null)) {
                sodexo = item.querySelector(".price-box .sodexo_icon").innerText;
              }
              if (!(item.querySelector(".dis_section span") == null)) {
                offer = item.querySelector(".dis_section span").innerText;
              }

              data.push({
                name: name,
                brand: brand,
                price: price,
                oldPrice: oldPrice,
                sodexo: sodexo,
                offer: offer
              });
            }

            return data;

          }).then((result) => {
            console.log(result.length);
            console.log("Saved!");
            //console.log(result.length);
            fs.writeFileSync('details10.txt', result.join('\n') + '\n');
          }).catch((err) => { console.log(err) })
        }
      })
    }
  })


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
