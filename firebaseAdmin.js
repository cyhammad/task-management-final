import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';

const app = !getApps().length ? initializeApp({
  credential: cert({
    "type": "service_account",
    "project_id": "taskmanagement-a5d8a",
    "private_key_id": "d8104e704a1cb749291e6bd08755449f348dc370",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC0IrKOV0PjbZRm\nqtQXpdGQNEwQfM9e6aP96S8yhH3s9jmOSC/m9EGKHdl+rFNCVOs/TOeoTj1dbZAl\nIzuaEKOdk6ASA2ifbbYOdZLqkfwcek+Mr/rgKs/0ScYXaW1b2U2INTzBSRO0dBTW\nw8lch0ALVykj0KsHTwl1IHaiKn2KuAniGtzFNAsEhhTLSHt2A3THuG7VRt4xU8tD\n5mN0+nT6hS/7kwWaqluxd4W6JAe7UUM8jqIQ0fw1drm1Fz8kPv1bKT/3rXSHxNBD\nKZi9qJ1AE1uubhIyug27VF40Oh+Tbl/3GoTskovEejSXYAVyKoUlvgtW798WxLWK\nTHyMPhHLAgMBAAECggEAAqq+2DlCu1osewBArdPAXT4ak2XqdhFhSOMyb5eJlVmo\nTLFIUEcoHA2vSJJWYaJU1BxlE6QkGwvohe9v58SJf5qnbiZxxQAaIW9F/3lHPi6x\nzdEiY3F1ObzIrrqnXVd2yYAsSAC3RquVtJmA4JqG04QoJKxN7YisiN9Nq/H5tA6/\nrUfxBRmCioU1ht0qqycKTorsP0rKfR05jTSEyUyw6btTS5eq90fTyF+i2ZjE7FZ2\nCnqvC/u/Qv9Wtr8gI1EtYT0aMBw1LJT0q61ymAlrP/mAm77NltCSE12SP7eBZkyG\n9IL9+iKoCsrFJVumxjjwwSqqeSUBwkpktjIzxAtd0QKBgQD1Pax+BkoVrE5Dr7UA\na1LgO+jLTavjrnjExYhdrxMiK+rPkaZjKdUZ6mkMTfh7lFe6rqyePi8iksTWVEyJ\no1Ek+4g1rACkym8zQ/zlx8CtenqrXk7GQrKIoMWlD11YFlpai0fF9Q1e7JKoRDXb\nnnumYu8SXttmXWaCfHTRgastuwKBgQC8CdGE9vid7YJxja/VnI/0WXafirVkwavc\nTGDSSznSVt05uxBKLMPhPWHJl/Y4kTMApEapVfLplfpVpjkaHpEpE6Ym0B8wQObJ\n0FACAopUxRuVC8/mOWLqTTpe/pDDh6alnLMWr2DuFySJd8/sR+YfnCav/UGjrWBB\nueLdZTFjMQKBgEmSaAYiwuT/nTcnJkjq6aEFuBANzCxw8iAuFnvsgvP0cuw0iNMl\nAJ5WuY8McSg515vUvUp341Ie79hQz+lWyogqwbFAWa0WYgfiNKOGqqIgpV5123IV\nHlRozwJ2uo0rn42cTTrxCkLY/CJo3DN3tyaydYBwXqe2C4PH7I/Rs9XzAoGAG9b8\nTUpffspWYMeQe/jlG1FPjcl0l8lQz5oDT79RfUHdGRoIDGNaUPPMkZNNIgzlVzf7\nOkD+aPUKjjnBBIv4A/PjyqVPqM5DHSgZYGLN5kUUk1mfWz+t1HDArqXT+w8Pbj+o\nCDjJChclErFJeHsgqBdvZukBGeGmebSy0QKVcFECgYAfbj1YBSP6ZoIK21Dmyr2d\nEUWncby4jdctdpfMFy6vjzuP3SafiC9I3Emg33glVOkfDj2VAnTYv+kwf29HNSvG\nAITNrGi82L+PPC9NCZdoLoPKMIGvhGeR1F5UfQS4mYfm5wJ8y6WOApZgZsywjMLH\nnzcAD0GddVWIRM2dLal2qA==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-sl3jh@taskmanagement-a5d8a.iam.gserviceaccount.com",
    "client_id": "112326372220137814959",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-sl3jh%40taskmanagement-a5d8a.iam.gserviceaccount.com"
  })
}) : getApp();
const adminDb = getFirestore();
const adminStorage = getStorage();
const adminAuth = getAuth(app);

export { adminDb, adminStorage, adminAuth };