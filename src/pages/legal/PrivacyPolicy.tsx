import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const PrivacyPolicy: React.FC = () => {
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
              <div className="p-3 bg-green-100 rounded-full">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              {t('legal.privacyTitle')}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {t('legal.lastUpdated')}: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed">
                  JoYed'S ("nous", "notre", "nos") respecte votre vie privée et s'engage à protéger vos données personnelles. 
                  Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations 
                  lorsque vous utilisez Job'Share.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Informations que nous collectons</h2>
                <div className="text-gray-700 leading-relaxed space-y-2">
                  <p>Nous collectons les types d'informations suivants :</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>Informations de compte :</strong> nom, adresse e-mail, mot de passe</li>
                    <li><strong>Fichiers et contenu :</strong> documents, images et autres fichiers que vous téléchargez</li>
                    <li><strong>Données d'utilisation :</strong> journaux d'activité, adresses IP, informations sur l'appareil</li>
                    <li><strong>Cookies et technologies similaires :</strong> pour améliorer votre expérience</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Comment nous utilisons vos informations</h2>
                <div className="text-gray-700 leading-relaxed space-y-2">
                  <p>Nous utilisons vos informations pour :</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Fournir et maintenir le service Job'Share</li>
                    <li>Authentifier votre identité et sécuriser votre compte</li>
                    <li>Stocker et organiser vos fichiers</li>
                    <li>Faciliter le partage de fichiers selon vos instructions</li>
                    <li>Améliorer nos services et développer de nouvelles fonctionnalités</li>
                    <li>Vous contacter concernant votre compte ou nos services</li>
                    <li>Respecter nos obligations légales</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Partage d'informations</h2>
                <div className="text-gray-700 leading-relaxed space-y-2">
                  <p>Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations uniquement dans les cas suivants :</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Avec votre consentement explicite</li>
                    <li>Avec les personnes que vous choisissez de partager vos fichiers</li>
                    <li>Avec nos prestataires de services de confiance (hébergement, support technique)</li>
                    <li>Pour respecter les obligations légales ou répondre aux demandes des autorités</li>
                    <li>Pour protéger nos droits, notre propriété ou notre sécurité</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Sécurité des données</h2>
                <div className="text-gray-700 leading-relaxed space-y-2">
                  <p>Nous mettons en place des mesures de sécurité robustes :</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Chiffrement des données en transit et au repos</li>
                    <li>Authentification sécurisée et contrôle d'accès</li>
                    <li>Surveillance continue de la sécurité</li>
                    <li>Sauvegardes régulières et redondance des données</li>
                    <li>Formation du personnel sur la sécurité des données</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Vos droits</h2>
                <div className="text-gray-700 leading-relaxed space-y-2">
                  <p>Vous avez le droit de :</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Accéder à vos données personnelles</li>
                    <li>Corriger ou mettre à jour vos informations</li>
                    <li>Supprimer votre compte et vos données</li>
                    <li>Exporter vos données dans un format portable</li>
                    <li>Limiter le traitement de vos données</li>
                    <li>Vous opposer au traitement de vos données</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Conservation des données</h2>
                <p className="text-gray-700 leading-relaxed">
                  Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services 
                  ou respecter nos obligations légales. Les fichiers supprimés sont conservés dans la corbeille pendant 30 jours 
                  avant d'être définitivement supprimés.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Cookies et technologies de suivi</h2>
                <p className="text-gray-700 leading-relaxed">
                  Nous utilisons des cookies et technologies similaires pour améliorer votre expérience, 
                  analyser l'utilisation du service et personnaliser le contenu. Vous pouvez gérer vos préférences 
                  de cookies dans les paramètres de votre navigateur.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Transferts internationaux</h2>
                <p className="text-gray-700 leading-relaxed">
                  Vos données peuvent être transférées et traitées dans des pays autres que votre pays de résidence. 
                  Nous nous assurons que ces transferts respectent les lois applicables sur la protection des données.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Modifications de cette politique</h2>
                <p className="text-gray-700 leading-relaxed">
                  Nous pouvons mettre à jour cette politique de confidentialité périodiquement. 
                  Nous vous informerons des modifications importantes par e-mail ou via une notification dans l'application.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact</h2>
                <p className="text-gray-700 leading-relaxed">
                  Pour toute question concernant cette politique de confidentialité ou vos données personnelles, 
                  contactez notre délégué à la protection des données à : 
                  <a href="mailto:privacy@joyeds.com" className="text-blue-600 hover:underline ml-1">
                    privacy@joyeds.com
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

export default PrivacyPolicy;