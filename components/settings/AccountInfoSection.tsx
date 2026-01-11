import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface AccountInfoSectionProps {
  user: any;
  onResendVerification: () => Promise<void>;
  sendingVerification: boolean;
}

export default function AccountInfoSection({ 
  user, 
  onResendVerification, 
  sendingVerification 
}: AccountInfoSectionProps) {
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'Н/П';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Н/П';
      
      return date.toLocaleDateString('bg-BG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Н/П';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#00BFA6]/10 rounded-lg flex items-center justify-center">
            <Info size={18} className="text-[#00BFA6] sm:w-5 sm:h-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#1F1F1F]">
            Информация за акаунта
          </h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between py-2 sm:py-3 border-b border-[#F5F5F5]">
            <span className="text-[#777777]">Статус на акаунта</span>
            <span className="font-medium text-green-600 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600"></div>
              {user?.status === 'active' ? 'Активен' : user?.status || 'Н/П'}
            </span>
          </div>

          <div className="flex justify-between py-2 sm:py-3 border-b border-[#F5F5F5]">
            <span className="text-[#777777]">Член от</span>
            <span className="font-medium text-[#1F1F1F]">
              {formatDate(user?.createdAt)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 sm:py-3 gap-2 sm:gap-0">
            <span className="text-[#777777]">Потвърден имейл</span>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className={`text-xs sm:text-sm font-medium flex items-center gap-2 ${user?.email_verified ? 'text-green-600' : 'text-orange-600'}`}>
                <div className={`w-2 h-2 rounded-full ${user?.email_verified ? 'bg-green-600' : 'bg-orange-600'}`}></div>
                {user?.email_verified ? 'Да' : 'Не'}
              </span>
              {!user?.email_verified && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={sendingVerification}
                  onClick={onResendVerification}
                  className="border-[#00BFA6] text-[#00BFA6] hover:bg-[#00BFA6]/5 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingVerification ? (
                    <>
                      <div className="w-3 h-3 border-2 border-[#00BFA6] border-t-transparent rounded-full animate-spin mr-1.5"></div>
                      Изпращане...
                    </>
                  ) : (
                    'Изпрати имейл'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}