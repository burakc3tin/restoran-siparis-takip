import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Header from './components/Header/Header';
import MenuSection from './components/MenuSection/MenuSection';
import OrderSection from './components/OrderSection/OrderSection';
import AddProductModal from './components/AddProductModal/AddProductModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal/DeleteConfirmationModal';
import ProductDetailModal from './components/ProductDetailModal/ProductDetailModal';
import PaymentModal from './components/PaymentModal/PaymentModal';
import SuccessModal from './components/SuccessModal/SuccessModal';
import PastPaymentsModal from './components/PastPaymentsModal/PastPaymentsModal';
import ShareMenuModal from './components/ShareMenuModal/ShareMenuModal';
import ProductGroupModal from './components/ProductGroupModal/ProductGroupModal';
import RewardsModal from './components/RewardsModal/RewardsModal';
import Footer from './components/Footer/Footer';
import { getUrunler, getUrunGruplari, addOdeme } from './services/firebase';
import { useLanguage } from './context/LanguageContext';
import { useProductActions } from './hooks/useProductActions';
import './App.css';

export default function App() {
  const { t } = useLanguage();
  const { deleteProduct, deleteMultipleProducts, loading: isDeletingAction } = useProductActions();
  const [order, setOrder] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [urunGruplari, setUrunGruplari] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionMode, setActionMode] = useState('order'); // 'order', 'edit', 'delete', 'delete-multi'
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Delete Confirmation State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Detail Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);

  // Payment State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPastPaymentsModal, setShowPastPaymentsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, groupsData] = await Promise.all([
        getUrunler(),
        getUrunGruplari()
      ]);
      setMenuItems(productsData);
      setUrunGruplari(groupsData);
    } catch (error) {
      console.error("Veriler yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductAdded = (newProduct) => {
    setMenuItems(prev => [...prev, newProduct]);
  };

  const handleProductUpdated = (updatedProduct) => {
    setMenuItems(prev => prev.map(item => item.id === updatedProduct.id ? updatedProduct : item));
  };

  const handleItemClick = async (item) => {
    if (actionMode === 'order') {
      handleAddToOrder(item);
    } else if (actionMode === 'edit') {
      setEditingProduct(item);
      setShowAddModal(true);
    } else if (actionMode === 'delete') {
      setProductToDelete(item);
      setShowDeleteModal(true);
    } else if (actionMode === 'delete-multi') {
      setSelectedProducts(prev => 
        prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
      );
    }
  };

  const handleShowDetail = (item) => {
    setDetailProduct(item);
    setShowDetailModal(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete && selectedProducts.length === 0) return;
    try {
      if (actionMode === 'delete-multi') {
        await deleteMultipleProducts(selectedProducts);
        setMenuItems(prev => prev.filter(i => !selectedProducts.includes(i.id)));
        setSelectedProducts([]);
      } else {
        await deleteProduct(productToDelete.id);
        setMenuItems(prev => prev.filter(i => i.id !== productToDelete.id));
      }
      setShowDeleteModal(false);
      setProductToDelete(null);
      setActionMode('order');
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  const deleteMultiProducts = () => {
    if (selectedProducts.length === 0) return;
    setShowDeleteModal(true);
  };

  const handleAddToOrder = (item) => {
    setOrder((prevOrder) => {
      const existing = prevOrder.find((orderItem) => orderItem.id === item.id);
      if (existing) {
        return prevOrder.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        );
      }
      return [...prevOrder, { ...item, quantity: 1, orderItemId: Date.now() + Math.random() }];
    });
  };

  const toggleOrderSelection = (orderItemId) => {
    setSelectedOrders(prev => 
      prev.includes(orderItemId) ? prev.filter(id => id !== orderItemId) : [...prev, orderItemId]
    );
  };

  const handleCancel = () => {
    if (selectedOrders.length > 0) {
      setOrder(order.filter(o => !selectedOrders.includes(o.orderItemId)));
      setSelectedOrders([]);
    } else if (order.length > 0) {
      // If none selected, delete the last added
      setOrder(order.slice(0, -1));
    }
  };

  const handleClear = () => {
    setOrder([]);
    setSelectedOrders([]);
  };

  const handleCheckout = () => {
    if (order.length > 0) {
      setIsCheckoutLoading(true);
      setTimeout(() => {
        setIsCheckoutLoading(false);
        setShowPaymentModal(true);
      }, 2500); // 2.5 seconds delay
    } else {
      alert(t('warningOrderEmptyText'));
    }
  };

  const handleConfirmPayment = async (orderItems) => {
    try {
      // 2.5 seconds artificial delay to show the processor loader
      await new Promise(resolve => setTimeout(resolve, 2500));

      const date = new Date();
      const formatNumber = (num) => num.toString().padStart(2, '0');
      const formattedDate = `${formatNumber(date.getDate())}.${formatNumber(date.getMonth() + 1)}.${date.getFullYear()} - ${formatNumber(date.getHours())}:${formatNumber(date.getMinutes())}`;
      
      const paymentData = {
        date: formattedDate,
        totalItems: orderItems.length,
        totalAmount: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        products: orderItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      };

      await addOdeme(paymentData);
      
      setShowPaymentModal(false);
      setOrder([]);
      setSelectedOrders([]);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Ödeme kaydedilirken hata:", error);
      alert(t('errorUpdate'));
    }
  };

  return (
    <>
      {loading && (
        <div className="global-loader-overlay">
          <div className="loader-content">
            <Spinner animation="grow" variant="danger" className="mb-3 custom-spinner" />
            <h4 className="text-white fw-light loader-text">{t('loading')}</h4>
          </div>
        </div>
      )}

      <div className="bg-blobs">
        <div className="blob blob-white"></div>
        <div className="blob blob-dark"></div>
        <div className="blob blob-accent"></div>
      </div>
      <Container fluid className="app-container p-2 p-md-4 my-2 my-md-4">
        <Header 
          onShowPastPayments={() => setShowPastPaymentsModal(true)} 
          onShowShareMenu={() => setShowShareModal(true)}
          onShowRewards={() => setShowRewardsModal(true)}
        />
        <main className="main-content mt-3 pt-3 border-top border-secondary border-opacity-25">
          <Row className="g-4 align-items-stretch">
            <Col lg={8} xl={7} className="d-flex">
              <MenuSection 
                items={menuItems}
                urunGruplari={urunGruplari}
                onAdd={handleItemClick} 
                onShowDetail={handleShowDetail}
                onAddProduct={() => {
                  setEditingProduct(null);
                  setShowAddModal(true);
                }}
                actionMode={actionMode}
                setActionMode={setActionMode}
                selectedProducts={selectedProducts}
                onDeleteMulti={deleteMultiProducts}
              />
            </Col>
            <Col lg={4} xl={5} className="d-flex align-items-start">
              <OrderSection
                order={order}
                selectedOrders={selectedOrders}
                toggleOrderSelection={toggleOrderSelection}
                onCancel={handleCancel}
                onClear={handleClear}
                onCheckout={handleCheckout}
                isProcessing={isCheckoutLoading}
              />
            </Col>
          </Row>
        </main>
      </Container>
      <Footer />
      
      <AddProductModal 
        show={showAddModal} 
        onHide={() => {
          setShowAddModal(false);
          setEditingProduct(null);
          setActionMode('order');
        }}
        urunGruplari={urunGruplari}
        onShowGroupModal={() => setShowGroupModal(true)}
        onProductAdded={handleProductAdded}
        onProductUpdated={handleProductUpdated}
        editItem={editingProduct}
      />
      
      <ProductGroupModal
        show={showGroupModal}
        onHide={() => setShowGroupModal(false)}
        urunGruplari={urunGruplari}
        setUrunGruplari={setUrunGruplari}
      />

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => {
          if (!isDeletingAction) {
            setShowDeleteModal(false);
            setProductToDelete(null);
          }
        }}
        onConfirm={confirmDeleteProduct}
        itemName={actionMode === 'delete-multi' ? `${selectedProducts.length} adet seçili ürün` : productToDelete?.name}
        loading={isDeletingAction}
      />
      <ProductDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        product={detailProduct}
      />
      <PaymentModal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        order={order}
        onConfirmPayment={handleConfirmPayment}
      />
      <SuccessModal 
        show={showSuccessModal} 
        onHide={() => setShowSuccessModal(false)} 
      />
      <PastPaymentsModal 
        show={showPastPaymentsModal}
        onHide={() => setShowPastPaymentsModal(false)}
      />
      <ShareMenuModal 
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        menuItems={menuItems}
        urunGruplari={urunGruplari}
      />
      <RewardsModal 
        show={showRewardsModal}
        onHide={() => setShowRewardsModal(false)}
      />
    </>
  );
}
