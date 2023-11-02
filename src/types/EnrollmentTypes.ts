export const enum EnrollmentStatus {
    PENDING,
    ENROLLED,
    DROPOUT,
}

export function getDescriptionStatus(status: EnrollmentStatus) {
    switch (status) {
        case EnrollmentStatus.PENDING: {
            return "Pendiente"
        }
        case EnrollmentStatus.ENROLLED: {
            return "Inscrito"
        }
        case EnrollmentStatus.DROPOUT: {
            return "De baja"
        }
        default: {
            return ""
        }
    }
}