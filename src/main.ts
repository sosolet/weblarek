import './scss/styles.scss';
import { BuyerModel } from './components/Models/BuyerModel';
import { BasketModel } from './components/Models/BasketModel';
import { CatalogModel } from './components/Models/CatalogModel';
import { ApiModel } from './components/Models/ApiModel';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Card } from './components/View/Card';
import { ensureElement } from './utils/utils';
import { IProductItem } from './types';
import { CardPreview } from './components/View/CardPreview';
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { BasketProduct } from './components/View/BasketProduct';
import { Order } from './components/View/Order';
import { Contacts } from './components/View/Contаcts';
import { Success } from './components/View/Success';

const modalContainer = ensureElement<HTMLElement>('#modal-container');

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const api = new ApiModel(CDN_URL, API_URL);
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();
const modal = new Modal(modalContainer, events);
const basket = new Basket(basketTemplate, events);
const order = new Order(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);

// Отображение карточек товаров
events.on('catalog:get', () => {
  catalogModel.catalogProducts.forEach((item) => {
    const card = new Card(cardCatalogTemplate as HTMLTemplateElement, events, {
      onClick: () => events.emit('card:select', item),
    });
    ensureElement<HTMLElement>('.gallery').append(card.render(item));
  });
});

// Выбор карточки
events.on('card:select', (item: IProductItem) => {
  catalogModel.infoProduct = item;
});

// Модальное окно карточки товара
events.on('modal:open', (item: IProductItem) => {
  const cardPreview = new CardPreview(
    cardPreviewTemplate as HTMLTemplateElement,
    events,
    basketModel.checkProduct(item.id)
  );
  modal.content = cardPreview.render(item);
  modal.render();
});

// Добавление позиции в корзину (карточка)
events.on('card:addPosition', () => {
  if (catalogModel.infoProduct) {
    basketModel.addBasketProduct(catalogModel.infoProduct);
  }
  basket.basketCounter(basketModel.getCountProducts());
  modal.close();
});

// Удаление позиции из корзины (карточка)
events.on('card:deletePosition', () => {
  if (catalogModel.infoProduct) {
    basketModel.deleteProduct(catalogModel.infoProduct);
  }
  basket.basketCounter(basketModel.getCountProducts());
  modal.close();
});

// Модальное окно корзины
events.on('basket:open', () => {
  basket.basketCounter(basketModel.getCountProducts());
  basket.setTotalSum(basketModel.getCountProducts());
  basket.items = basketModel.basketProducts.map((item, index) => {
    const basketItem = new BasketProduct(cardBasketTemplate, events, {
      onClick: () => { events.emit('basket:basketProductDelete', item), events.emit('basket:open') },
    });
    return basketItem.render(item, index + 1);
  });
  modal.content = basket.render();
  modal.render();
});

// Удаление позиции из корзины
events.on('basket:basketProductDelete', (item: IProductItem) => {
  basketModel.deleteProduct(item);
});

// Модальное окно адреса и способа оплаты
events.on('order:open', () => {
  modal.content = order.render();
  modal.render();
});

// Запись способа оплаты
events.on('order:paymentSelection', (button: HTMLButtonElement) => { 
  if (button.name === 'card' || button.name === 'cash') {
    buyerModel.buyerInfo = { payment: button.name };
  }
});

// Запись адреса
events.on('order:changeAddress', (value: {address: string}) => {
  buyerModel.buyerInfo = value;
});

// Валидация
events.on('formErrors:order', () => {
  const { address, payment } = buyerModel.validateBuyer();
  order.valid = !address && !payment;
  order.formErrors = Object.values({ address, payment }).join(' ');
});

// Модальное окно телефона и почты
events.on('contacts:open', () => {
  modal.content = contacts.render();
  modal.render();
});

// Запись телефона/почты
events.on('contacts:contactsInput', (data: { field: string, value: string }) => {
  if (data.field === 'email') {
    buyerModel.buyerInfo = { email: data.value };
  } else {
    buyerModel.buyerInfo = { phone: data.value };
  }
});

// Валидация
events.on('formErrors:contacts', () => {
  const { email, phone } = buyerModel.validateBuyer();
  contacts.valid = !email && !phone;
  contacts.formErrors = Object.values({ phone, email }).join(' ');
})

// Оформление покупки
events.on('success:open', () => {
  const order = {
    total: basketModel.getTotalSum(),
    items: basketModel.basketProducts.map(item => item.id),
    ...buyerModel.buyerInfo
  };
  api.orderProducts(order)
    .then(() => {
      const success = new Success(successTemplate, events);
      modal.content = success.render(basketModel.getTotalSum());
      basketModel.clearBasket(); 
      basket.basketCounter(basketModel.getCountProducts()); 
      modal.render();
    })
    .catch(error => console.log(error));
});

events.on('success:close', () => modal.close());

// Получение данных с сервера
api.ProductList.then((data) => {
  // Запись и вывод товаров в класс CatalogModel
  catalogModel.catalogProducts = data;
  console.log(
    'Следующие данные получены и записаны в CatalogModel:',
    catalogModel.catalogProducts,
  );
  api.emitProductsLoaded(events);
}).catch((error) => {
  console.error('Ошибка получения данных:', error);
});
