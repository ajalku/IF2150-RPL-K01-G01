import { LABEL_STATUS, LABEL_TINGKAT, LABEL_VALIDASI } from "../utils/format.js";

export function LencanaStatus({ status }) {
  return <span className={`rw-badge st-${status}`}>{LABEL_STATUS[status] ?? status}</span>;
}

export function LencanaTingkat({ tingkat }) {
  return <span className={`rw-badge tk-${tingkat}`}>{LABEL_TINGKAT[tingkat] ?? tingkat}</span>;
}

export function LencanaValidasi({ status }) {
  return <span className={`rw-badge vl-${status}`}>{LABEL_VALIDASI[status] ?? status}</span>;
}
