import { useState } from 'react';
import './RiskAssessment.css';

interface RiskResult {
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  risk_level_text: string;
  risk_reasons: string[];
  recommendation: string;
  should_continue: boolean;
  suggested_escrow_days: number;
}

interface TransactionHistory {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'success' | 'failed';
}

interface BlacklistCheck {
  address: string;
  is_blacklisted: boolean;
  risk_tags: string[];
  reported_count: number;
  last_reported: string;
}

interface FundFlow {
  total_in: string;
  total_out: string;
  transaction_count: number;
  unique_addresses: number;
  suspicious_patterns: string[];
}

interface AddressRelation {
  address: string;
  relation_type: string;
  interaction_count: number;
  total_value: string;
  risk_level: 'low' | 'medium' | 'high';
}

export const RiskAssessment = () => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    buyer_address: '',
    seller_address: ''
  });
