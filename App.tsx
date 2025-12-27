
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { EventWizard } from './pages/EventWizard';
import { EventManager } from './pages/EventManager';
import { Settings } from './pages/Settings';
import { Evento, EventVersion } from './types';
import { mockEvents, mockVersions } from './services/mockData';

const App: React.FC = () => {
  const [events, setEvents] = useState<Evento[]>(() => {
    const saved = localStorage.getItem('semad_events');
    return saved ? JSON.parse(saved) : mockEvents;
  });

  const [versions, setVersions] = useState<EventVersion[]>(() => {
    const saved = localStorage.getItem('semad_versions');
    return saved ? JSON.parse(saved) : mockVersions;
  });

  const [globalTags, setGlobalTags] = useState<string[]>(() => {
    const saved = localStorage.getItem('semad_global_tags');
    return saved ? JSON.parse(saved) : ['Salário', 'Base', 'Encargo', 'Vantagem', 'Desconto Folha', 'Gratificação', 'Previdência', 'Imposto', 'Tributável', 'Férias'];
  });

  useEffect(() => {
    localStorage.setItem('semad_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('semad_versions', JSON.stringify(versions));
  }, [versions]);

  useEffect(() => {
    localStorage.setItem('semad_global_tags', JSON.stringify(globalTags));
  }, [globalTags]);

  const addEvent = (event: Evento, initialVersion: EventVersion) => {
    setEvents(prev => [...prev, event]);
    setVersions(prev => [...prev, initialVersion]);
  };

  const updateEvent = (updatedEvent: Evento) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const addVersion = (newVersion: EventVersion) => {
    setVersions(prev => [...prev, newVersion]);
  };

  const publishVersion = (versionId: string, eventId: string, motivo: string, objetivo: string) => {
    const now = new Date().toISOString();
    
    setVersions(prev => prev.map(v => {
      if (v.evento_id === eventId && v.status_versao === 'PUBLICADA') {
        return { ...v, status_versao: 'ARQUIVADA' as const };
      }
      if (v.id === versionId) {
        return { 
          ...v, 
          status_versao: 'PUBLICADA' as const,
          publicado_em: now,
          publicado_por: 'Administrador',
          motivo_mudanca: motivo,
          objetivo_mudanca: objetivo
        };
      }
      return v;
    }));

    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, versao_vigente_id: versionId, atualizado_em: now };
      }
      return e;
    }));
  };

  const updateVersionSnapshot = (versionId: string, snapshot: any) => {
    setVersions(prev => prev.map(v => v.id === versionId ? { ...v, snapshot_json: snapshot } : v));
  };

  const handleAddGlobalTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !globalTags.includes(trimmed)) {
      setGlobalTags(prev => [...prev, trimmed].sort());
    }
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard events={events} versions={versions} />} />
          <Route path="eventos/novo" element={
            <EventWizard 
              onSave={addEvent} 
              existingCodes={events.map(e => e.codigo)} 
              globalTags={globalTags}
              onAddTag={handleAddGlobalTag}
            />
          } />
          <Route path="eventos/:id/gerenciar" element={
            <EventManager 
              events={events} 
              versions={versions} 
              onUpdateEvent={updateEvent}
              onAddVersion={addVersion}
              onPublish={publishVersion}
              onUpdateSnapshot={updateVersionSnapshot}
              globalTags={globalTags}
              onAddGlobalTag={handleAddGlobalTag}
            />
          } />
          <Route path="configuracoes" element={<Settings globalTags={globalTags} setGlobalTags={setGlobalTags} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
