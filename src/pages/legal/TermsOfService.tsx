import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const TermsOfService: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/">
            <Button
              variant="outline"
              icon={<ArrowLeft className="h-5 w-5" />}
            >
              {t('common.back')}
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              {t('legal.termsTitle')}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {t('legal.lastUpdated')}: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptation des conditions</h2>
                <p className="text-gray-700 leading-relaxed">
                  En accédant et en utilisant Job'Share ("le Service"), vous acceptez d'être lié par ces Conditions d'utilisation. 
                  Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description du service</h2>
                <p className="text-gray-700 leading-relaxed">
                  Job'Share est une plateforme de partage de fichiers sécurisée qui permet aux utilisateurs de stocker, 
                  organiser, partager et collaborer sur des fichiers et documents. Le service est fourni par JoYed'S.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Comptes utilisateur</h2>
                <div className="text-gray-700 leading-relaxed space-y-2">
                  <p>Pour utiliser Job'Share, vous devez :</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Créer un compte avec des informations exactes et complètes</li>
                    <li>Maintenir la sécurité de votre mot de passe</li>
                    <li>Être responsable de toutes les activités sous votre compte</li>
                    <li>Nous notifier immédiatement de tout usage non autorisé</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Utilisation acceptable</h2>
                <div className="text-gray-700 leading-relaxed space-y-2">
                  <p>Vous vous engagez à ne pas :</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Télécharger du contenu illégal, offensant ou violant les droits d'autrui</li>
                    <li>Utiliser le service pour des activités malveillantes ou frauduleuses</li>
                    <li>Tenter d'accéder aux comptes d'autres utilisateurs</li>
                    <li>Interférer avec le fonctionnement du service</li>
                    <li>Violer les lois applicables</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Contenu et propriété intellectuelle</h2>
                <p className="text-gray-700 leading-relaxed">
                  Vous conservez tous les droits sur le contenu que vous téléchargez. En utilisant Job'Share, 
                  vous nous accordez une licence limitée pour stocker, traiter et afficher votre contenu 
                  uniquement dans le but de fournir le service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Confidentialité et sécurité</h2>
                <p className="text-gray-700 leading-relaxed">
                  Nous nous engageons à protéger vos données personnelles conformément à notre Politique de confidentialité. 
                  Nous utilisons des mesures de sécurité avancées pour protéger vos fichiers et informations.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limites de stockage</h2>
                <p className="text-gray-700 leading-relaxed">
                  Chaque compte dispose d'une limite de stockage. Les limites spécifiques dépendent de votre plan d'abonnement. 
                  Nous nous réservons le droit de supprimer les fichiers qui dépassent les limites de stockage.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Résiliation</h2>
                <p className="text-gray-700 leading-relaxed">
                  Nous pouvons suspendre ou résilier votre compte en cas de violation de ces conditions. 
                  Vous pouvez résilier votre compte à tout moment en nous contactant.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Limitation de responsabilité</h2>
                <p className="text-gray-700 leading-relaxed">
                  Job'Share est fourni "en l'état". Nous ne garantissons pas que le service sera ininterrompu ou exempt d'erreurs. 
                  Notre responsabilité est limitée dans la mesure permise par la loi.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Modifications des conditions</h2>
                <p className="text-gray-700 leading-relaxed">
                  Nous nous réservons le droit de modifier ces conditions à tout moment. 
                  Les modifications seront effectives dès leur publication sur cette page.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact</h2>
                <p className="text-gray-700 leading-relaxed">
                  Pour toute question concernant ces conditions, contactez-nous à : 
                  <a href="mailto:support@joyeds.com" className="text-blue-600 hover:underline ml-1">
                    support@joyeds.com
                  </a>
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;