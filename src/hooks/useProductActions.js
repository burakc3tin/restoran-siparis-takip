import { useState } from 'react';
import { addUrun, updateUrun, deleteUrun } from '../services/firebase';
import { useLanguage } from '../context/LanguageContext';

export const useProductActions = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const added = await addUrun(productData);
      setLoading(false);
      return added;
    } catch (err) {
      setLoading(false);
      setError(err);
      alert(t('errorAdd'));
      throw err;
    }
  };

  const updateProduct = async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateUrun(id, productData);
      setLoading(false);
      return updated;
    } catch (err) {
      setLoading(false);
      setError(err);
      alert(t('errorUpdate'));
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteUrun(id);
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      setError(err);
      alert(t('errorDelete'));
      throw err;
    }
  };

  const deleteMultipleProducts = async (ids) => {
    setLoading(true);
    setError(null);
    try {
      const deletePromises = ids.map(id => deleteUrun(id));
      await Promise.all(deletePromises);
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      setError(err);
      alert(t('errorDelete'));
      throw err;
    }
  };

  return {
    addProduct,
    updateProduct,
    deleteProduct,
    deleteMultipleProducts,
    loading,
    error
  };
};
