import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { BuyerModel } from './components/Models/BuyerModel';
import { BasketModel } from './components/Models/BasketModel';
import { CatalogModel } from './components/Models/CatalogModel';
import { ApiModel } from './components/Models/ApiModel';
import { API_URL, CDN_URL } from './utils/constants';

// CatalogModel
console.log('======| CatalogModel |======');
//Создание экземпляра класса CatalogModel
const catalog = new CatalogModel();

// Добавление товаров и их получение
catalog.catalogProducts = apiProducts.items;
console.log("Полный список товаров:", catalog.catalogProducts, "\n");

// Получение продукта по id и его вывод
const catalogItem = catalog.getProduct(catalog.catalogProducts[1].id);
console.log("Найденный продукт по id:", catalogItem, "\n");

// Сохранение и получение подробной информации о продукте
catalog.infoProduct = catalogItem;
console.log("Сохранённый продукт для полной информации:", catalog.infoProduct, "\n\n\n");


// BasketModel
console.log('======| BasketModel |======');
//Создание экземпляра класса BasketModel
const basket = new BasketModel();

// Добавление нескольких продуктов в корзину, проверка их наличия и вывод корзины
basket.basketProducts = catalog.catalogProducts[0];
basket.basketProducts = catalog.catalogProducts[1];
basket.basketProducts = catalog.catalogProducts[2];
basket.basketProducts = catalog.catalogProducts[2];
console.log("Добавленные в корзину продукты: ", basket.basketProducts, "\n");

// Удаление одной позиции из корзины
basket.deleteProduct(catalog.catalogProducts[1]);
console.log("Обновлённая корзина: ", basket.basketProducts, "\n");

// Стоимость корзины
console.log("Стоимость корзины: ", basket.getTotalSum(), "\n");

// Общая сумма товаров в корзине
console.log("Общая сумма товаров в корзине: ", basket.getCountProducts(), "\n");

// Очистка всей корзины
basket.clearBasket();
console.log("Корзина после очистки: ", basket.basketProducts, "\n\n\n");


// BuyerModel
console.log('======| BuyerModel |======');
//Создание экземпляра класса BuyerModel
const buyer = new BuyerModel();

// Запись данных о покупателе и их получение
buyer.buyerInfo = { payment: 'card' };
console.log('Записанные данные: ', buyer.buyerInfo, "\n");
buyer.buyerInfo = { 
  email: 'email@gmail.com', 
  phone: '+7 999 888 77 66' 
};
console.log('Записанные данные: ', buyer.buyerInfo, "\n");

// Валидация данных
console.log('Результат валидации', buyer.validateBuyer(), "\n");

// Запись данных о покупателе и их получение
buyer.buyerInfo = { 
  addres: 'улица Льва Толстого, 16', 
  email: 'email@gmail.com', 
  phone: '+7 999 888 77 66', 
  payment: 'card' 
};
console.log('Записанные данные: ', buyer.buyerInfo, "\n");

// Валидация данных
console.log('Результат валидации', buyer.validateBuyer(), "\n");

// Очистка данных пользователя
buyer.clearBuyerInfo();
console.log('Данные пользователя после очистки', buyer.buyerInfo, "\n\n\n");


// ApiModel
console.log('======| ApiModel |======');
//Создание экземпляра класса ApiModel
const api = new ApiModel(CDN_URL, API_URL);

// Получение данных с сервера
api.ProductList.then((data) => {
  // Запись и вывод товаров в класс CatalogModel
  catalog.catalogProducts = data;
  console.log('Результат:', catalog.catalogProducts);
}).catch((error) => {
  console.error('Ошибка получения данных:', error);
});
