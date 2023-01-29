import { gql } from "@apollo/client";

export const PRIOR_AUTH_LIST = gql`
  query PriorAuthList(
    $tenant: String!
    $page: Int
    $limit: Int
    $appointmentStatus: AppointmentStatus
    $authStatus: AuthStatus
  ) {
    priorAuthList(
      tenant: $tenant
      page: $page
      limit: $limit
      appointmentStatus: $appointmentStatus
      authStatus: $authStatus
    ) {
      pages
      resources {
        tag
        appointmentId
        patientId
        appointmentStart
        appointmentStatus
        isPriorAuthSubmissionEnabled
        serviceType {
          text
        }
        patientRead {
          resource {
            firstName
            lastName
          }
        }
      }
    }
  }
`;
