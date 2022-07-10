import { appInfo } from './app.information';
import { contextsE as ctx } from 'src/app/application/enums/contexts.enum';

export const KEYWORD_LAYOUT = 'layout';
export const HOME = {
  icon: 'assets/images/favicon/32x32.png',
  name: appInfo['company'],
};
const ICONS_URL = 'assets/images/sidebar/icons';

export const SIDENAV = [
  {
    type: 'link',
    title: 'Dashboard',
    icon: `${ICONS_URL}/dashboard.svg`,
    route: `${KEYWORD_LAYOUT}/dashboard`,
  },
  {
    type: 'accordion',
    title: 'Seguridad',
    permission: '0900',
    contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
    routes: [
      {
        title: 'Asignar permisos',
        icon: `${ICONS_URL}/seguridad/asignar-permisos.svg`,
        route: `${KEYWORD_LAYOUT}/seguridad/asignar-permisos`,
        permission: '0901',
        contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
      },
    ],
  },
  {
    type: 'accordion',
    title: 'Balances de enfermería',
    permission: '0200',
    contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
    routes: [
      {
        title: 'Sabanas UCI',
        icon: `${ICONS_URL}/balances-enfermeria/sabanas-uci.svg`,
        route: `${KEYWORD_LAYOUT}/balances-enfermeria/sabanas-uci`,
        permission: '0201',
        contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
      },
    ],
  },
  {
    type: 'accordion',
    title: 'Hospitalización',
    permission: '0100',
    contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
    routes: [
      {
        icon: `${ICONS_URL}/hospitalizacion/censo-pacientes.svg`,
        title: 'Censo de pacientes',
        route: `${KEYWORD_LAYOUT}/hospitalizacion/censo-pacientes`,
        permission: '0101',
        contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
      },
      {
        icon: `${ICONS_URL}/hospitalizacion/jornada-dietas.svg`,
        title: 'Jornada de dietas',
        route: `${KEYWORD_LAYOUT}/hospitalizacion/jornada-dietas`,
        permission: '0102',
        contexts: [ctx.ALTA_CENTRO,ctx.AMMEDICAL],
      },
      {
        icon: `${ICONS_URL}/hospitalizacion/registro-jornada-dietas.svg`,
        title: 'Registro jornada de dietas',
        route: `${KEYWORD_LAYOUT}/hospitalizacion/registro-jornada-dietas`,
        permission: '0103',
        contexts: [ctx.ALTA_CENTRO, ctx.AMMEDICAL],
      },
      {
        icon: `${ICONS_URL}/hospitalizacion/censo-camas.svg`,
        title: 'Censo de camas',
        route: `${KEYWORD_LAYOUT}/hospitalizacion/censo-camas`,
        permission: '0104',
        contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
      },
    ],
  },
  {
    type: 'accordion',
    title: 'Historia Clínica',
    permission: '0300',
    contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
    routes: [
      {
        icon: `${ICONS_URL}/historia-clinica/desconfirmar-epicrisis.svg`,
        title: 'Desconfirmar epicrisis',
        route: `${KEYWORD_LAYOUT}/historia-clinica/desconfirmar-epicrisis`,
        permission: '0301',
        contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
      },
      {
        icon: `${ICONS_URL}/historia-clinica/interconsultas-pendientes.svg`,
        title: 'Interconsultas pendientes',
        route: `${KEYWORD_LAYOUT}/historia-clinica/interconsultas-pendientes`,
        permission: '0302',
        contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
      },
    ],
  },
  {
    type: 'accordion',
    title: 'Facturación',
    permission: '0400',
    contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
    routes: [
      {
        icon: `${ICONS_URL}/facturacion/conceptos-admision.svg`,
        title: 'Conceptos de admisión',
        route: `${KEYWORD_LAYOUT}/facturacion/conceptos-admision`,
        permission: '0401',
        contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
      },
    ],
  },
  {
    type: 'accordion',
    title: 'Informes gerenciales',
    permission: '0500',
    contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
    routes: [
      {
        icon: `${ICONS_URL}/informes-gerenciales/facturacion-periodo.svg`,
        title: 'Facturación por periodo',
        route: `${KEYWORD_LAYOUT}/informes-gerenciales/facturacion-periodo`,
        permission: '0501',
        contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
      },
      {
        icon: `${ICONS_URL}/informes-gerenciales/estadistico-pfgp.svg`,
        title: 'Estadistico PFGP',
        route: `${KEYWORD_LAYOUT}/informes-gerenciales/estadistico-pfgp`,
        permission: '0502',
        contexts: [ctx.AGUACHICA, ctx.ALTA_CENTRO, ctx.AMMEDICAL, ctx.VALLEDUPAR],
      },
      {
        icon: `${ICONS_URL}/informes-gerenciales/estadistico-radicacion.svg`,
        title: 'Estadistico de radicación',
        route: `${KEYWORD_LAYOUT}/informes-gerenciales/estadistico-radicacion`,
        permission: '0503',
        contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
      },
    ],
  },
  {
    type: 'accordion',
    title: 'Radicación',
    permission: '0600',
    contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
    routes: [
      {
        icon: `${ICONS_URL}/radicacion/reporte-sabanas.svg`,
        title: 'Reporte de sabanas',
        route: `${KEYWORD_LAYOUT}/radicacion/reporte-sabanas`,
        permission: '0601',
        contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
      },
    ],
  },
  {
    type: 'accordion',
    title: 'Cartera',
    permission: '0700',
    contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
    routes: [
      {
        icon: `${ICONS_URL}/cartera/gestion.svg`,
        title: 'Gestión',
        route: `${KEYWORD_LAYOUT}/cartera/gestion`,
        permission: '0701',
        contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
      },
      {
        icon: `${ICONS_URL}/cartera/conciliacion.svg`,
        title: 'Conciliación',
        route: `${KEYWORD_LAYOUT}/cartera/conciliacion`,
        permission: '0702',
        contexts: [ctx.AGUACHICA,ctx.ALTA_CENTRO,ctx.AMMEDICAL,ctx.SANJUAN,ctx.VALLEDUPAR],
      },
    ],
  },
];
