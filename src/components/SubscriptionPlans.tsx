
import React, { useState } from 'react';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { createSubscription } from '../services/database';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './ui/use-toast';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  duration: string;
  originalPrice?: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 'R159.00',
    duration: 'per month',
    features: [
      'Real-time price comparisons',
      'Basic price alerts',
      'Access to 8+ major retailers',
      'Mobile app access',
      'Email support'
    ],
    icon: <Zap className="h-6 w-6" />
  },
  {
    id: 'quarterly',
    name: '3 Months',
    price: 'R299.00',
    duration: 'for 3 months',
    originalPrice: 'R477.00',
    features: [
      'Everything in Monthly',
      'Advanced price alerts',
      'Price history tracking',
      'Weekly savings reports',
      'Priority support',
      'Save R178!'
    ],
    icon: <Star className="h-6 w-6" />,
    popular: true
  },
  {
    id: 'biannual',
    name: '6 Months',
    price: 'R599.00',
    duration: 'for 6 months',
    originalPrice: 'R954.00',
    features: [
      'Everything in 3 Months',
      'Premium analytics dashboard',
      'Bulk shopping lists',
      'Personal shopping advisor',
      'WhatsApp support',
      'Save R355!'
    ],
    icon: <Crown className="h-6 w-6" />
  }
];

interface SubscriptionPlansProps {
  onSelectPlan: (planId: string) => void;
}

export const SubscriptionPlans = ({ onSelectPlan }: SubscriptionPlansProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('quarterly');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId);
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to select a subscription plan.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const selectedPlanData = PRICING_PLANS.find(plan => plan.id === planId);
      if (!selectedPlanData) {
        throw new Error('Plan not found');
      }

      // Extract numeric price value
      const price = parseFloat(selectedPlanData.price.replace('R', '').replace(',', ''));

      const subscription = await createSubscription({
        planId: planId,
        planName: selectedPlanData.name,
        price: price
      });

      toast({
        title: "Subscription Created",
        description: `Successfully subscribed to ${selectedPlanData.name} plan!`,
      });

      onSelectPlan(planId);
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Subscription Failed",
        description: "There was an error creating your subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Plan</h2>
        <p className="text-gray-600">Save more on groceries with our comprehensive price tracking</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedPlan === plan.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${plan.popular ? 'ring-2 ring-blue-200' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className={`p-3 rounded-full ${
                  selectedPlan === plan.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {plan.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-800">{plan.price}</span>
                </div>
                <p className="text-gray-600 text-sm">{plan.duration}</p>
                {plan.originalPrice && (
                  <p className="text-gray-400 line-through text-sm">was {plan.originalPrice}</p>
                )}
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full ${
                selectedPlan === plan.id
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handlePlanSelect(plan.id);
              }}
              disabled={loading}
            >
              {loading && selectedPlan === plan.id 
                ? 'Processing...' 
                : selectedPlan === plan.id 
                  ? 'Selected' 
                  : 'Select Plan'
              }
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>All plans include a 7-day free trial. Cancel anytime.</p>
        {!user && (
          <p className="mt-2 text-blue-600">Please log in to purchase a subscription plan.</p>
        )}
      </div>
    </div>
  );
};
