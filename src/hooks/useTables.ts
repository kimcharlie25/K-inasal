import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Table {
  id: string;
  name: string;
  qr_url: string;
  created_at: string;
}

export const useTables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('tables')
        .select('*')
        .order('id', { ascending: true });

      if (fetchError) throw fetchError;

      setTables(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching tables:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tables');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTable = useCallback(async (customName?: string) => {
    try {
      // Get the next table number by finding items
      const { data: existingTables } = await supabase
        .from('tables')
        .select('name')
        .order('created_at', { ascending: false });

      const nextNum = existingTables ? existingTables.length + 1 : 1;
      const tableName = customName || `Table ${nextNum}`;
      const baseUrl = window.location.origin;
      const qrUrl = `${baseUrl}/?table=${encodeURIComponent(tableName)}`;

      const { data, error: insertError } = await supabase
        .from('tables')
        .insert({
          name: tableName,
          qr_url: qrUrl,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchTables();
      return data;
    } catch (err) {
      console.error('Error adding table:', err);
      throw err;
    }
  }, [fetchTables]);

  const deleteTable = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('tables')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchTables();
    } catch (err) {
      console.error('Error deleting table:', err);
      throw err;
    }
  }, [fetchTables]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  return {
    tables,
    loading,
    error,
    addTable,
    deleteTable,
    refetch: fetchTables,
  };
};

