import './scss/styles.scss';
import { BuyerModel } from './components/Models/BuyerModel';
import { BasketModel } from './components/Models/BasketModel';
import { CatalogModel } from './components/Models/CatalogModel';
import { ApiModel } from './components/Models/ApiModel';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { CardCatalog } from './components/View/CardCatalog';
import { ensureElement, cloneTemplate } from './utils/utils';
import { IProductItem } from './types';
import { CardPreview } from './components/View/CardPreview';
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { CardBasket } from './components/View/CardBasket';
import { Order } from './components/View/Order';
import { Contacts } from './components/View/Contаcts';
import { Success } from './components/View/Success';
import { Gallery } from './components/View/Gallery';
import { Header } from './components/View/Header';
import { Api } from './components/base/Api';

const modalContainer = ensureElement<HTMLElement>('#modal-container');
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const headerContainer = ensureElement<HTMLElement>('.header__container');

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const api = new Api(API_URL);
const apiModel = new ApiModel(api);
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);
const modal = new Modal(modalContainer, events);
const basket = new Basket(cloneTemplate<HTMLTemplateElement>(basketTemplate), events);
const order = new Order(cloneTemplate<HTMLTemplateElement>(orderTemplate), events);
const contacts = new Contacts(cloneTemplate<HTMLTemplateElement>(contactsTemplate), events);
const cardPreview = new CardPreview(cloneTemplate<HTMLTemplateElement>(cardPreviewTemplate), events);
const success = new Success(cloneTemplate<HTMLTemplateElement>(successTemplate), events);
const gallery = new Gallery(galleryContainer, events);
const header = new Header(headerContainer, events);


// Отображение карточек товаров
events.on('catalog:get', () => {
  gallery.items = catalogModel.catalogProducts.map((item) => {
    const cardCatalog = new CardCatalog(cloneTemplate<HTMLTemplateElement>(cardCatalogTemplate), events, {
      onClick: () => events.emit('card:select', item),
    });
    cardCatalog.category = item.category;
    cardCatalog.title = item.title;
    cardCatalog.image = item.image;
    cardCatalog.price = item.price;
    return cardCatalog.render();
  });
  gallery.render();
});

// Выбор карточки
events.on('card:select', (item: IProductItem) => {
  catalogModel.infoProduct = item;
});

// Модальное окно карточки товара
events.on('modal:open', (item: IProductItem) => {
  cardPreview.description = item.description;
  cardPreview.category = item.category;
  cardPreview.title = item.title;
  cardPreview.image = item.image;
  cardPreview.price = item.price;
  cardPreview.updateButton(basketModel.checkProduct(item.id));
  modal.content = cardPreview.render();
  modal.render();
  modal.open();
});

// Покупка / удаление из корзины (карточка)
events.on('preview:toggle', () => {
  const product = catalogModel.infoProduct;
  if (product) {
    if (basketModel.checkProduct(product.id)) {
      basketModel.deleteBasketProduct(product);
      cardPreview.updateButton(false);
    } else {
      basketModel.addBasketProduct(product);
      cardPreview.updateButton(true);
    }
  }
  modal.close();
});

// Изменение кнопки корзины
events.on('header:changed', () => {
  header.basketCounter(basketModel.getCountProducts());
});

// Изменения корзины 
events.on('basket:changed', () => {
  basket.items = basketModel.basketProducts.map((item, index) => {
    const basketItem = new CardBasket(cloneTemplate<HTMLTemplateElement>(cardBasketTemplate), events, {
      onClick: () => { events.emit('basket:basketProductDelete', item), events.emit('basket:open') },
    });
    basketItem.index = index + 1;
    basketItem.title = item.title;
    basketItem.price = item.price;
    return basketItem.render();
  });
  basket.setTotalSum(basketModel.getTotalSum());
});

// Модальное окно корзины
events.on('basket:open', () => {
  modal.content = basket.render();
  modal.render();
  modal.open();
});

// Удаление позиции из корзины
events.on('basket:basketProductDelete', (item: IProductItem) => {
  cardPreview.updateButton(basketModel.checkProduct(item.id));
  basketModel.deleteBasketProduct(item);
});

// Модальное окно адреса и способа оплаты
events.on('order:open', () => {
  modal.content = order.render();
  modal.render();
  modal.open();
});

// Запись способа оплаты
events.on('order:paymentSelection', (value: {payment: 'card' | 'cash' | ''}) => { 
  buyerModel.buyerInfo = value;
});

// Запись адреса
events.on('order:changeAddress', (value: {address: string}) => {
  buyerModel.buyerInfo = value;
});

// Модальное окно телефона и почты
events.on('contacts:open', () => {
  modal.content = contacts.render();
  modal.render();
  modal.open();
});

// Запись телефона/почты
events.on('contacts:contactsInput', (data: { field: string, value: string }) => {
  if (data.field === 'email') {
    buyerModel.buyerInfo = { email: data.value };
  } else {
    buyerModel.buyerInfo = { phone: data.value };
  }
});

events.on('buyer:changed', () => {
  const errors = buyerModel.validateBuyer();
  
  order.formErrors = Object.values({ 
    address: errors.address, 
    payment: errors.payment 
  }).filter(Boolean).join(', ');
  
  contacts.formErrors = Object.values({ 
    phone: errors.phone, 
    email: errors.email 
  }).filter(Boolean).join(', ');
  
  const isOrderValid = !errors.address && !errors.payment;
  const isContactsValid = !errors.email && !errors.phone;
  
  order.valid = isOrderValid;
  contacts.valid = isContactsValid;
});

// Оформление покупки
events.on('success:open', () => {
  const order = {
    total: basketModel.getTotalSum(),
    items: basketModel.basketProducts.map(item => item.id),
    ...buyerModel.buyerInfo
  };
  apiModel.orderProducts(order)
    .then(() => {
      success.description = order.total;
      modal.content = success.render();
      basketModel.clearBasket(); 
      buyerModel.clearBuyerInfo();
      header.basketCounter(basketModel.getCountProducts()); 
      modal.render();
      modal.open();
    })
    .catch(error => console.log(error));
});

events.on('success:close', () => {
  modal.close()
});

events.on('buyer:clear', () => {
  order.valid = false;
  contacts.clearContacts();
  order.clearOrder();
});

// Получение данных с сервера
apiModel.getProductList().then((data) => {
  // Запись и вывод товаров в класс CatalogModel
  catalogModel.catalogProducts = data.items;
  console.log(
    'Следующие данные получены и записаны в CatalogModel:',
    catalogModel.catalogProducts,
  );
}).catch((error) => {
  console.error('Ошибка получения данных:', error);
});
