import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Table {
  id: number;
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

  const addTable = useCallback(async () => {
    try {
      // Get the next table number by finding the max ID
      const { data: existingTables } = await supabase
        .from('tables')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      const nextId = existingTables && existingTables.length > 0 
        ? existingTables[0].id + 1 
        : 1;

      const tableName = `Table ${nextId}`;
      const baseUrl = window.location.origin;
      const qrUrl = `${baseUrl}/?table=${nextId}`;

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

  const deleteTable = useCallback(async (id: number) => {
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

