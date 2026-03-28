#!/usr/bin/env node
/**
 * Añade el campo Short text `section` al content type `blogPost` vía Content Management API.
 *
 * Requiere en .env.local (o en el entorno):
 *   CONTENTFUL_MANAGEMENT_TOKEN
 *   CONTENTFUL_SPACE_ID
 *   CONTENTFUL_ENVIRONMENT   (opcional, default: master)
 *
 * Uso:
 *   node scripts/contentful-add-blogpost-section-field.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('contentful-management');

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    // .env.local wins over shell (evita placeholders como tu-space-id en el entorno)
    process.env[key] = val;
  }
}

const SECTION_FIELD = {
  id: 'section',
  name: 'Sección',
  type: 'Symbol',
  localized: true,
  required: false,
  validations: [
    {
      in: ['prensa', 'eventos', 'multimedia'],
      message: 'Usá: prensa, eventos o multimedia (minúsculas)',
    },
  ],
};

async function main() {
  loadEnvLocal();

  const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const envId = process.env.CONTENTFUL_ENVIRONMENT || 'master';

  if (!token || !spaceId) {
    console.error(
      'Falta CONTENTFUL_MANAGEMENT_TOKEN o CONTENTFUL_SPACE_ID (.env.local o entorno).'
    );
    process.exit(1);
  }

  const client = createClient({ accessToken: token });
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(envId);

  let contentType;
  try {
    contentType = await environment.getContentType('blogPost');
  } catch (e) {
    console.error(
      'No se encontró el content type "blogPost". Creálo primero en Contentful o corregí el id.'
    );
    console.error(e.message || e);
    process.exit(1);
  }

  const fields = contentType.fields || [];
  if (fields.some((f) => f.id === 'section')) {
    console.log('El campo "section" ya existe en blogPost. No hace falta cambiar nada.');
    process.exit(0);
  }

  contentType.fields = [...fields, SECTION_FIELD];

  const updated = await contentType.update();
  await updated.publish();

  console.log(
    'Listo: campo "section" (Symbol, valores prensa | eventos | multimedia) añadido y content type publicado.'
  );
}

main().catch((err) => {
  console.error(err.response?.data || err.message || err);
  process.exit(1);
});
