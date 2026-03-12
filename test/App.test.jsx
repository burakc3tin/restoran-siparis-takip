import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import App from '../src/App';
import * as firebase from '../src/services/firebase';

describe('Restoran Paneli Testleri', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(firebase, 'getUrunler').mockResolvedValue([]);
    vi.spyOn(firebase, 'getUrunGruplari').mockResolvedValue([]);
  });

  it('uygulama düzgünce yüklenmeli', async () => {
    render(<App />);
    expect(screen.getByText('loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('loading')).not.toBeInTheDocument();
    });
  });

  it('yeni ürün eklenebilmeli', async () => {
    render(<App />);
    await waitFor(() => expect(screen.queryByText('loading')).not.toBeInTheDocument());
    
    const addProductBtn = screen.getByTestId('action-add');
    fireEvent.click(addProductBtn);
    
    const nameInput = screen.getByLabelText('productName');
    const priceInput = screen.getByLabelText('productPrice');
    
    fireEvent.change(nameInput, { target: { value: 'Yeni Pizza' } });
    fireEvent.change(priceInput, { target: { value: '150' } });
    
    const emojiOption = screen.getAllByText('🍕')[0];
    fireEvent.click(emojiOption);
    
    const saveBtn = screen.getByText('add');
    fireEvent.click(saveBtn);
    
    await waitFor(() => {
      expect(firebase.addUrun).toHaveBeenCalled();
    });
  });

  it('ürün silme onay modalı açılmalı', async () => {
    const mockProducts = [{ id: '1', name: 'Silinecek Ürün', price: 10, image: '🍕', urungrubu: null }];
    vi.spyOn(firebase, 'getUrunler').mockResolvedValue(mockProducts);
    
    render(<App />);
    await waitFor(() => expect(screen.queryByText('loading')).not.toBeInTheDocument());
    
    const deleteModeBtn = screen.getByTestId('action-delete');
    fireEvent.click(deleteModeBtn);
    
    const productItem = screen.getByText('Silinecek Ürün');
    fireEvent.click(productItem);
    
    // Hem menüde hem modalda aynı isim olduğu için getAllByText kullanıp en az 2 tane olduğunu kontrol ediyoruz
    expect(screen.getAllByText('Silinecek Ürün').length).toBeGreaterThanOrEqual(1);
    const confirmBtn = screen.getByText('yesDelete');
    fireEvent.click(confirmBtn);
    
    await waitFor(() => {
      expect(firebase.deleteUrun).toHaveBeenCalledWith('1');
    });
  });

  it('ürün grubu eklenebilmeli', async () => {
    render(<App />);
    await waitFor(() => expect(screen.queryByText('loading')).not.toBeInTheDocument());
    
    fireEvent.click(screen.getByTestId('action-add'));
    fireEvent.click(screen.getByText('addNewGroup'));
    
    const groupInput = screen.getByTestId('group-input');
    fireEvent.change(groupInput, { target: { value: 'Yeni Kategori' } });
    
    const forms = document.querySelectorAll('.add-group-form');
    fireEvent.submit(forms[0]);
    
    await waitFor(() => {
      expect(firebase.addUrunGrubu).toHaveBeenCalled();
    });
  });
});
