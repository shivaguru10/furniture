import { isSupabaseConfigured, supabase } from './supabase';

let homepageConfigCache = null;

export const configService = {
  async getHomepageConfig() {
    if (homepageConfigCache) return homepageConfigCache;
    if (!isSupabaseConfigured) {
      homepageConfigCache = {};
      return homepageConfigCache;
    }

    try {
      const { data, error } = await supabase
        .from('homepage_config')
        .select('*');

      if (error) throw error;

      homepageConfigCache = (data || []).reduce((acc, item) => {
        acc[item.id] = item.data;
        return acc;
      }, {});
      return homepageConfigCache;
    } catch (_) {
      homepageConfigCache = {};
      return {};
    }
  },

  async updateConfig(id, configData) {
    homepageConfigCache = null;
    const { data, error } = await supabase
      .from('homepage_config')
      .upsert({ id, data: configData, updated_at: new Date() })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
