'use client';

import { useState, useEffect } from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { Button } from '@/components/ui/button';
import { NotificationPreferences as PreferencesType } from '@/types/notification';

export default function NotificationPreferences() {
  const { preferences, fetchPreferences, updatePreferences } = useNotificationStore();
  const [localPrefs, setLocalPrefs] = useState<PreferencesType>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  useEffect(() => {
    if (Object.keys(preferences).length > 0) {
      setLocalPrefs(preferences);
    }
  }, [preferences]);

  const notificationTypes = [
    { key: 'marketing', label: 'Маркетинг и промоции' },
    { key: 'system', label: 'Системни съобщения' },
  ];

  const handleToggle = (type: keyof PreferencesType) => {
    setLocalPrefs((prev) => ({
      ...prev,
      [type]: {
        in_app: !prev[type]?.in_app,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await updatePreferences(localPrefs);
      setMessage('Предпочитанията са запазени успешно!');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Грешка при запазване');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.includes('успешно')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-3">
        {notificationTypes.map((type) => {
          const isEnabled = localPrefs[type.key]?.in_app !== false;

          return (
            <div
              key={type.key}
              className="flex items-center justify-between p-4 border border-[#E0E0E0] rounded-lg hover:border-[#00BFA6] transition-colors"
            >
              <label htmlFor={`notification-${type.key}`} className="flex-1 cursor-pointer">
                <p className="font-medium text-[#1F1F1F]">{type.label}</p>
              </label>

              {/* Custom Checkbox */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id={`notification-${type.key}`}
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => handleToggle(type.key as keyof PreferencesType)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#E0E0E0] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00BFA6]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BFA6]"></div>
              </label>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? 'Запазване...' : 'Запази промените'}
        </Button>
      </div>
    </div>
  );
}
