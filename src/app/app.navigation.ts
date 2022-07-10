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
];
