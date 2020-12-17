/*
 * Copyright (C) 2017, 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import {LspClient} from './lsp-client';
import {MessageType} from 'vscode-languageserver';

export interface Logger {
  error(...arg: any[]): void;
  warn(...arg: any[]): void;
  info(...arg: any[]): void;
  log(...arg: any[]): void;
}

export class LspClientLogger implements Logger {
  constructor(protected client: LspClient, protected level: MessageType) {}

  protected sendMessage(severity: MessageType, messageObjects: any[]): void {
    if (this.level >= severity) {
      let message = messageObjects
        .map(p => {
          if (typeof p === 'object') {
            return JSON.stringify(p, null, 2);
          } else {
            return p;
          }
        })
        .join(' ');

      this.client.logMessage({
        type: severity,
        message: message,
      });
    }
  }

  error(...arg: any[]): void {
    this.sendMessage(MessageType.Error, arg);
  }

  warn(...arg: any[]): void {
    this.sendMessage(MessageType.Warning, arg);
  }

  info(...arg: any[]): void {
    this.sendMessage(MessageType.Info, arg);
  }

  log(...arg: any[]): void {
    this.sendMessage(MessageType.Log, arg);
  }
}

function toString(...arg: any[]): string {
  return arg.map(a => JSON.stringify(a, null, 2)).join('');
}

export class ConsoleLogger implements Logger {
  constructor(private isLogEnabled?: boolean) {}

  error(...arg: any[]) {
    console.error(toString(...arg));
  }
  warn(...arg: any[]) {
    console.warn(toString(...arg));
  }
  info(...arg: any[]) {
    console.info(toString(...arg));
  }
  log(...arg: any[]) {
    if (this.isLogEnabled) {
      console.log(toString(...arg));
    }
  }
}

export class PrefixingLogger implements Logger {
  constructor(private logger: Logger, private prefix: string) {}

  error(...arg: any[]): void {
    this.logger.error(toString(this.prefix, ...arg));
  }

  warn(...arg: any[]): void {
    this.logger.warn(toString(this.prefix, ...arg));
  }

  info(...arg: any[]): void {
    this.logger.info(toString(this.prefix, ...arg));
  }

  log(...arg: any[]): void {
    this.logger.log(toString(this.prefix, ...arg));
  }
}
