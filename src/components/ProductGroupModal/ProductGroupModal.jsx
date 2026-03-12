import { useState } from 'react';
import { Modal, Button, Form, ListGroup, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import { addUrunGrubu, updateUrunGrubu, deleteUrunGrubu } from '../../services/firebase';
import successSound from '../../assets/sound/success.mp3';
import wrongSound from '../../assets/sound/wrong.mp3';
import './ProductGroupModal.css';

export default function ProductGroupModal({ show, onHide, urunGruplari, setUrunGruplari }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const renderTooltip = (text) => (
    <Tooltip id="button-tooltip">{text}</Tooltip>
  );

  const playSuccess = () => {
    const audio = new Audio(successSound);
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Ses çalınamadı:", e));
  };

  const playWrong = () => {
    const audio = new Audio(wrongSound);
    audio.volume = 0.4;
    audio.play().catch(e => console.error("Ses çalınamadı:", e));
  };

  const handleAddGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      playWrong();
      return;
    }

    setLoading(true);
    try {
      const addedGroup = await addUrunGrubu({ name: newGroupName.trim() });
      setUrunGruplari(prev => [...prev, addedGroup]);
      setNewGroupName('');
      playSuccess();
    } catch (error) {
      console.error("Grup eklenirken hata:", error);
      playWrong();
      alert(t('errorGroup'));
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (grup) => {
    setEditingGroupId(grup.id);
    setEditGroupName(grup.name);
  };

  const handleUpdateGroup = async (id) => {
    if (!editGroupName.trim()) {
      playWrong();
      return;
    }

    setLoading(true);
    try {
      await updateUrunGrubu(id, { name: editGroupName.trim() });
      setUrunGruplari(prev => prev.map(g => g.id === id ? { ...g, name: editGroupName.trim() } : g));
      setEditingGroupId(null);
      setEditGroupName('');
      playSuccess();
    } catch (error) {
      console.error("Grup güncellenirken hata:", error);
      playWrong();
      alert(t('errorGroup'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (id) => {
    // Basic JS confirm, as requested simplicity
    if (window.confirm(t('deleteConfirmTitle') + "?")) {
      setDeleteLoadingId(id);
      try {
        await deleteUrunGrubu(id);
        setUrunGruplari(prev => prev.filter(g => g.id !== id));
        playSuccess();
      } catch (error) {
        console.error("Grup silinirken hata:", error);
        playWrong();
        alert(t('errorGroup'));
      } finally {
        setDeleteLoadingId(null);
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="product-group-modal" backdrop="static">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title className="w-100 d-flex align-items-center gap-2">
          <i className="bi bi-collection text-danger"></i>
          {t('groupCrudModalTitle')}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <Form onSubmit={handleAddGroup} className="mb-4 d-flex gap-2 add-group-form">
          <Form.Control
            type="text"
            placeholder={t('groupName')}
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            disabled={loading}
            className="custom-input bg-dark text-white border-secondary"
            data-testid="group-input"
          />
          <OverlayTrigger placement="top" trigger={isMobile ? [] : 'hover'} overlay={renderTooltip(t('add'))}>
            <Button variant="danger" type="submit" disabled={loading || !newGroupName.trim()}>
              {loading ? <Spinner animation="border" size="sm" /> : <i className="bi bi-plus-lg"></i>}
            </Button>
          </OverlayTrigger>
        </Form>

        <div className="groups-list">
          {urunGruplari.length === 0 ? (
            <div className="text-center text-white-50 my-4">
              {t('noGroupsData')}
            </div>
          ) : (
            <ListGroup variant="flush">
              {urunGruplari.map(grup => (
                <ListGroup.Item key={grup.id} className="bg-transparent border-secondary text-white d-flex justify-content-between align-items-center py-3 px-0">
                  {editingGroupId === grup.id ? (
                    <div className="d-flex w-100 gap-2 editing-container">
                      <Form.Control
                        type="text"
                        value={editGroupName}
                        onChange={(e) => setEditGroupName(e.target.value)}
                        disabled={loading}
                        className="custom-input bg-dark text-white border-secondary form-control-sm"
                        autoFocus
                      />
                      <Button variant="success" size="sm" onClick={() => handleUpdateGroup(grup.id)} disabled={loading}>
                        <i className="bi bi-check-lg"></i>
                      </Button>
                      <Button variant="outline-light" size="sm" onClick={() => setEditingGroupId(null)} disabled={loading}>
                        <i className="bi bi-x-lg"></i>
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="fw-medium">{grup.name}</span>
                      <div className="d-flex gap-2">
                        <OverlayTrigger placement="top" trigger={isMobile ? [] : 'hover'} overlay={renderTooltip(t('edit'))}>
                          <Button variant="outline-light" size="sm" className="btn-icon" onClick={() => startEditing(grup)}>
                            <i className="bi bi-pencil-fill"></i>
                          </Button>
                        </OverlayTrigger>
                        
                        <OverlayTrigger placement="top" trigger={isMobile ? [] : 'hover'} overlay={renderTooltip(t('delete'))}>
                          <Button variant="outline-danger" size="sm" className="btn-icon" onClick={() => handleDeleteGroup(grup.id)} disabled={deleteLoadingId === grup.id}>
                            {deleteLoadingId === grup.id ? <Spinner animation="border" size="sm" /> : <i className="bi bi-trash3-fill"></i>}
                          </Button>
                        </OverlayTrigger>
                      </div>
                    </>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
