import axiosClient from './client';
import { ENDPOINTS } from './endpoints';
import log from '../utils/Logger';

//  UI-friendly Lead shape - NO nulls allowed (cleaned at API boundary)
export interface Lead {
  id: string;
  leadId: string;
  contactName: string;
  businessName: string;
  phoneNumber: string;
  leadType: string;
  interestedProducts: string;
  leadSource: string;
  createdBy: string;
  approvalStatus: string;
  leadStatus: string;
  country?: string;
  state?: string;
  city?: string;
  zone?: string;
  pincode?: string;
  address?: string;
  expectedConversionDate?: string;
}

// User object from API
interface ApiUser {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

//  Raw API response - nulls allowed here (API contract)
interface ApiLead {
  id: string;
  code: string;
  contact_name: string;
  contact_phone: string;
  business_name: string;
  type?:
    | {
        value: string;
        label: string;
      }
    | string
    | null;
  interested_product: unknown[];
  source?:
    | {
        value: string;
        label: string;
      }
    | string
    | null;
  created_by: string | ApiUser;
  approval_status?: {
    value: string;
    label: string;
  } | null;
  status?: {
    value: string;
    label: string;
  } | null;
}

interface LeadsListResponse {
  data: ApiLead[];
  count?: number;
  total?: number;
  active_records?: number;
  inactive_records?: number;
  message?: string;
  status?: boolean;
  next?: string | null;
  previous?: string | null;
  page?: number;
  page_size?: number;
}

//  Extract user name from created_by field
const getCreatedByName = (createdBy: string | ApiUser): string => {
  if (typeof createdBy === 'string') {
    return 'Unknown User';
  }

  if (createdBy && typeof createdBy === 'object') {
    const firstName = createdBy.first_name ?? '';
    const lastName = createdBy.last_name ?? '';
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || createdBy.email || 'Unknown User';
  }

  return 'Unknown User';
};

//  Transform API response to UI model (clean nulls here)
const mapApiLeadToLead = (apiLead: ApiLead): Lead => {
  // Map interested_product array to comma-separated string
  let interestedProducts = 'N/A';
  if (Array.isArray(apiLead.interested_product) && apiLead.interested_product.length > 0) {
    interestedProducts = apiLead.interested_product
      .map((item) => {
        if (typeof item === 'string') return item;
        if (
          item &&
          typeof item === 'object' &&
          'label' in (item as unknown as Record<string, unknown>)
        ) {
          return String((item as unknown as Record<string, unknown>).label);
        }
        return '';
      })
      .filter(Boolean)
      .join(', ');
  }

  return {
    id: apiLead.id,
    leadId: apiLead.code,
    contactName: apiLead.contact_name,
    businessName: apiLead.business_name,
    phoneNumber: apiLead.contact_phone,
    leadType:
      typeof apiLead.type === 'string'
        ? apiLead.type || 'N/A'
        : apiLead.type?.label ?? apiLead.type?.value ?? 'N/A',
    interestedProducts,
    leadSource:
      typeof apiLead.source === 'string'
        ? apiLead.source || 'N/A'
        : apiLead.source?.label ?? apiLead.source?.value ?? 'N/A',
    createdBy: getCreatedByName(apiLead.created_by),
    approvalStatus: apiLead.approval_status?.label ?? apiLead.approval_status?.value ?? 'N/A',
    leadStatus: apiLead.status?.label ?? apiLead.status?.value ?? 'N/A',
  };
};

export const leadApi = {
  fetchLeads: async (): Promise<Lead[]> => {
    const res = await axiosClient.get<LeadsListResponse | ApiLead[]>(ENDPOINTS.CORE.LEAD);
    log.debug('leadApi.fetchLeads response:', res);
    const apiResponseData: LeadsListResponse | ApiLead[] = res.data;
    let apiLeads: ApiLead[] = [];

    if (apiResponseData) {
      if (Array.isArray(apiResponseData)) {
        apiLeads = apiResponseData;
      } else if (apiResponseData.data && Array.isArray(apiResponseData.data)) {
        apiLeads = apiResponseData.data;
      }
    }

    const mapped = apiLeads.map(mapApiLeadToLead);
    log.debug('leadApi.fetchLeads mapped leads:', mapped);
    return mapped;
  },
};

export default leadApi;
