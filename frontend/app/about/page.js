'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain,
  Code2,
  Server,
  Shield,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lock,
} from 'lucide-react';

import { Button } from '@/components/ui/Button.jsx';
import { Card } from '@/components/ui/Card.jsx';
import { HomeButton } from '@/components/layout/HomeButton.jsx';

export default function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description:
        'The configured machine learning model analyzes submitted application details and returns an eligibility estimate.',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description:
        'Receive a prediction after the configured API processes your application.',
    },
    {
      icon: Lock,
      title: 'Data handling',
      description:
        'Application details are sent to the configured FastAPI service. This browser tab keeps the current application snapshot and response in sessionStorage for the result report.',
    },
    {
      icon: CheckCircle2,
      title: 'Transparent Insights',
      description:
        'Every prediction comes with a clear explanation of which factors influenced the result.',
    },
  ];

  const technologyItems = [
    {
      icon: Brain,
      name: 'Machine Learning',
      description:
        'A trained classification model evaluates financial profiles against historical loan data patterns.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Code2,
      name: 'Explainable AI (SHAP)',
      description:
        "SHAP (SHapley Additive exPlanations) values quantify how each input feature pushes the prediction up or down, making the model's reasoning transparent.",
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: Server,
      name: 'FastAPI',
      description:
        'A modern, fast Python web framework provides a reliable and performant API layer for real-time predictions.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Brain,
      name: 'Next.js',
      description:
        'The frontend is built with Next.js for a fast, responsive, and SEO-friendly user experience across all devices.',
      color: 'from-gray-500 to-gray-600',
    },
  ];

  return (
    <div className="about-page loanai-page-bg min-h-screen text-gray-900 dark:text-gray-100">
      <header className="mx-auto flex max-w-7xl justify-end px-4 pt-5 sm:px-6 lg:px-8">
        <HomeButton />
      </header>

      {/* Page Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/50">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              About{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                LoanAI
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We believe financial decisions should be transparent. LoanAI uses
              explainable AI to help you understand your loan eligibility — not
              just tell you the answer.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              What Is LoanAI?
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              LoanAI is a web application that analyzes your financial
              information and produces an AI-based assessment of your loan
              eligibility. It&apos;s built for transparency — every result comes
              with an explanation of the contributing factors.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-fr">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="h-full"
              >
                <Card
                  animate={false}
                  className="
                    h-full
                    min-h-[220px]
                    p-6
                    hover:shadow-lg
                    transition-all
                    duration-300
                    border
                    border-gray-200
                    dark:border-gray-800
                    flex
                    flex-col
                  "
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-lg flex items-center justify-center mb-4 flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {feature.title}
                  </h3>

                  <p className="flex-1 text-gray-600 dark:text-gray-300 text-sm leading-6">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How the ML Prediction Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              How the Machine Learning Prediction Works
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              At a high level, the prediction pipeline takes your application
              details, processes them through a trained model, and returns an
              assessment along with feature explanations.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Data Collection',
                description:
                  'You provide basic financial information through a structured form: income, employment status, credit history, property details, and more.',
              },
              {
                step: '02',
                title: 'Data Preprocessing',
                description:
                  'Your inputs are standardized — categorical fields (like "Graduate" or "Urban") are converted to a numeric format the model can understand, and values are validated.',
              },
              {
                step: '03',
                title: 'Model Inference',
                description:
                  'The preprocessed data is sent to a trained classification model. The model evaluates your profile against patterns learned from historical loan data and produces an eligibility assessment.',
              },
              {
                step: '04',
                title: 'Explainable AI Insights',
                description:
                  'SHAP values are computed to determine how much each of your input features pushed the prediction in a positive or negative direction. These are shown to you so you understand why the model reached its conclusion.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Explainable AI / SHAP Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Why Explainable AI Matters
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Traditional financial models are often &quot;black boxes&quot; — they
                give you a decision but no reasoning. LoanAI uses explainable
                AI to remove that opacity.
              </p>

              <div className="space-y-4">
                {[
                  "Every feature's contribution to the final result is quantified and shown.",
                  'Positive (+) and negative (-) impacts make it easy to see what helps or hurts.',
                  'You can review which supplied features contributed to the model score.',
                  "SHAP explains this model output; it does not establish causation or a lender's reasoning.",
                ].map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.08,
                    }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />

                    <span className="text-gray-700 dark:text-gray-300">
                      {point}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  variant="primary"
                  asChild
                  className="!bg-blue-600 !text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:!bg-blue-700 hover:shadow-xl hover:shadow-blue-500/25"
                >
                  <Link href="/predict">
                    Try the Prediction
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-white">
                    How returned SHAP values are presented
                  </h4>

                  <span className="text-xs text-gray-400">
                    Actual response only
                  </span>
                </div>

                <p className="text-xs text-gray-400 mb-4">
                  After an application is submitted, LoanAI displays the
                  contribution values returned by the prediction service. No
                  sample decision or sample SHAP values are shown here.
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <p className="text-sm font-semibold text-emerald-300">
                      Positive contributions
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-300">
                      Returned values above zero are shown as factors that move
                      the model score toward approval.
                    </p>
                  </div>

                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
                    <p className="text-sm font-semibold text-rose-300">
                      Negative contributions
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-300">
                      Returned values below zero are shown as factors that move
                      the model score away from approval.
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-5 text-gray-400">
                  SHAP explains this model response; it does not establish
                  causation or a lender’s reasoning.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Technology Stack
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built with modern, production-ready technologies for performance
              and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 auto-rows-fr gap-6 sm:grid-cols-2">
            {technologyItems.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="h-full"
              >
                <Card
                  animate={false}
                  className="flex h-full flex-col border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg dark:border-gray-800"
                >
                  <div className="mb-3 flex min-h-14 items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${tech.color}`}>
                      <tech.icon className="w-5 h-5 text-white" />
                    </div>

                    <h3 className="flex min-h-10 items-center text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100">
                      {tech.name}
                    </h3>
                  </div>

                  <p className="flex-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {tech.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                  Important Disclaimer
                </h3>

                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  LoanAI provides a{' '}
                  <strong className="text-gray-900 dark:text-gray-100">
                    model-generated prediction
                  </strong>{' '}
                  only. This is an automated assessment based on the information
                  you provide and the patterns learned by the machine learning
                  model.
                </p>

                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong className="text-gray-900 dark:text-gray-100">
                    It is not a loan offer, a credit decision, or a guarantee of
                    approval
                  </strong>
                  . Any real loan approval is determined solely by licensed
                  financial institutions after their own evaluation, and may
                  differ from this prediction.
                </p>

                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Use the results for informational purposes only. Do not rely
                  on them for financial decisions without consulting a qualified
                  financial advisor or lender.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to See the Analysis?
            </h2>

            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Start your prediction and explore how LoanAI explains each factor
              that influences the result.
            </p>

            <Button
              asChild
              variant="secondary"
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Link href="/predict">
                Start Your Prediction
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
