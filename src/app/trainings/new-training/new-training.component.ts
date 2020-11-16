import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { TrainingService } from '../training.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ActionType, TrainingInfo } from '../training.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit {
  constructor(
    public trainingsService: TrainingService,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}
  private mode = 'new-training';
  isLoading = false;
  trainingInfo: TrainingInfo;
  form: FormGroup;
  requestHeaderForm: FormGroup;
  responseHeaderForm: FormGroup;
  mimeType: string;
  authTypes: ActionType[] = [
    { value: '', viewValue: 'Authorization Type' },
    { value: 'BasicAuth', viewValue: 'Basic Auth' },
    { value: 'ApiKey', viewValue: 'API Key' },
    { value: 'NoAuth', viewValue: 'No Auth' },
    { value: 'BearerToken', viewValue: 'Bearer Token' },
  ];
  actionTypes: ActionType[] = [
    { value: '', viewValue: 'Action Type' },
    { value: 'SOAP', viewValue: 'SOAP' },
    { value: 'RESTFUL', viewValue: 'Restful' },
  ];
  methodTypes: ActionType[] = [
    { value: '', viewValue: 'Method Type' },
    { value: 'GET', viewValue: 'GET' },
    { value: 'POST', viewValue: 'POST' },
    { value: 'PUT', viewValue: 'PUT' },
    { value: 'DELETE', viewValue: 'DELETE' },
    { value: 'PATCH', viewValue: 'PATCH' },
  ];
  authType = '';
  actionType = '';
  methodType = '';
  ngOnInit(): void {
    this.authType = this.authTypes.values.name;
    this.actionType = this.actionTypes.values.name;
    this.methodType = this.methodTypes.values.name;
    this.form = new FormGroup({
      serviceUrl: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      authType: new FormControl(null, { validators: [Validators.required] }),
      actionType: new FormControl(),
      soapAction: new FormControl(),
      methodType: new FormControl(),
      username: new FormControl(),
      password: new FormControl(),
      tokenKey: new FormControl(),
      tokenValue: new FormControl(),
      headerKey: new FormControl(),
      headerValue: new FormControl(),
      requestContent: new FormControl(),
      // responseContent: new FormControl(null, {
      //   validators: [Validators.required],
      // }),
      responseContent: new FormControl("", { validators: [Validators.required] }),
    });
    this.requestHeaderForm = this.formBuilder.group({
      requestHeaders: this.formBuilder.array([
        this.formBuilder.group({ headerKey: '', headerValue: '' }),
      ]),
    });
    this.responseHeaderForm = this.formBuilder.group({
      responseHeaders: this.formBuilder.array([
        this.formBuilder.group({ headerKey: '', headerValue: '' }),
      ]),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.mode = 'new-training';
    });

    this.route.queryParams.subscribe((params) => {
      this.form.patchValue({ serviceUrl: params.service || '' });
    });
  }

  get requestHeaders() {
    return this.requestHeaderForm.get('requestHeaders') as FormArray;
  }

  get responseHeaders() {
    return this.responseHeaderForm.get('responseHeaders') as FormArray;
  }

  addHeaderKeys(type) {
    if (type === 'request') {
      this.requestHeaders.push(
        this.formBuilder.group({ headerKey: '', headerValue: '' })
      );
    } else if (type === 'response') {
      this.responseHeaders.push(
        this.formBuilder.group({ headerKey: '', headerValue: '' })
      );
    }
  }

  removeHeaderKeys(index, type) {
    if (type === 'request') {
      this.requestHeaders.removeAt(index);
    } else if (type === 'response') {
      this.responseHeaders.removeAt(index);
    }
  }

  onChangeAuthType(authType): void {
    this.authType = authType;
  }

  onChangeActionType(actionType): void {
    this.actionType = actionType;
  }

  updateTrainingInfo(trainingInfo: TrainingInfo) {
    const reqHeaders = this.requestHeaderForm.value.requestHeaders;
    const resHeaders = this.responseHeaderForm.value.responseHeaders;
    for (const reqHeader of reqHeaders) {
      if (reqHeader.headerKey !== '')
        trainingInfo.request.headers[reqHeader.headerKey] =
          reqHeader.headerValue;
    }
    for (const resHeader of resHeaders) {
      if (resHeader.headerKey !== '')
        trainingInfo.response.headers[resHeader.headerKey] =
          resHeader.headerValue;
    }
  }

  onSaveTraining() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'new-training') {
      this.trainingInfo = {
        service: this.form.value.serviceUrl,
        // authorization: {
        //   authType: this.form.value.authType,
        //   username: this.form.value.username,
        //   password: this.form.value.password,
        //   tokenkey: this.form.value.tokenkey,
        //   tokenValue: this.form.value.tokenValue,
        // },
        request: {
          headers: {
            actionType: this.form.value.actionType,
            Method:
              this.form.value.actionType === 'SOAP'
                ? 'POST'
                : this.form.value.methodType,
            ...(this.form.value.actionType === 'SOAP' && {
              soapAction: this.form.value.soapAction,
            }),
          },
          raw_data: this.form.value.requestContent || "",
        },
        response: {
          headers: {
            actionType: this.form.value.actionType,
            Method:
              this.form.value.actionType === 'SOAP'
                ? 'POST'
                : this.form.value.methodType,
            ...(this.form.value.actionType === 'SOAP' && {
              soapAction: this.form.value.soapAction,
            }),
          },
          raw_data: this.form.value.responseContent,
        },
      };
      if (this.form.value.actionType === 'SOAP') {
        this.trainingInfo.request.headers.soapAction = this.form.value.soapAction;
      }
      this.updateTrainingInfo(this.trainingInfo);
      this.trainingsService.addNewTraining(this.trainingInfo);
    }
    this.form.reset();
  }
}
