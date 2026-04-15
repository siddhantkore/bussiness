# Land Ownership Information System - Site Audit Addendum

Date: 2026-04-15

## Problem Statement

Provide stakeholders with reliable information on land ownership details, dates executed, income details, and encumbrances on the property.

This means the system should do more than store a few property fields. It should help a user, reviewer, and admin understand who owns the land, when the transfer or deed was executed, whether the property is burdened by loans or legal claims, and whether the property generates any income that should be recorded.

## What The System Still Needs

### 1. User authentication and logout

The workflow needs actual login and logout behavior. Without it, the system cannot distinguish a public visitor from a property owner, reviewer, or administrator.

Needed improvements:

- login page
- logout action
- session handling
- route protection
- role-aware redirects

### 2. Separate user, admin, and reviewer panels

The current structure does not clearly separate who can do what. A proper implementation should have different experiences for different roles.

Suggested panels:

- user panel for submissions and record lookup
- admin panel for management and oversight
- reviewer panel for approval and verification
- stakeholder panel for read-only access to property intelligence

### 3. Structured property record model

The system should track each property as a structured record instead of a loose form.

Core fields to include:

- property ID
- village/town/city
- survey or plot number
- owner name
- previous owner history
- date executed
- registration reference
- document references
- current status

### 4. Ownership timeline

Stakeholders need to see the ownership chain in a way that is easy to audit.

The timeline should include:

- transfer date
- deed or document type
- transfer reason
- parties involved
- approval or verification status
- supporting evidence

### 5. Encumbrance tracking

Encumbrances should be a first-class part of the system, not an afterthought.

Record types to support:

- mortgage
- loan
- lien
- court stay
- attachment
- legal notice
- pending release certificate

Useful fields:

- lender or authority name
- amount outstanding
- start date
- end date
- account or reference number
- current status

### 6. Income details for the property

The requirement mentions income as well, so the system should support income-linked property information.

Examples:

- rent income
- lease income
- agricultural income
- commercial usage income
- government compensation or benefit linked to the property

Useful fields:

- income source
- amount
- frequency
- period
- supporting document
- verification status

### 7. Optional location on map

This should be supported as an optional field, not a mandatory one.

Why optional:

- some properties may not have accurate coordinates
- users may only know the textual address or survey details
- forcing map location can block submission

What to support:

- map pin selection
- latitude and longitude
- search by locality
- reviewer map preview
- fallback to text address when coordinates are not available

### 8. Document management

Property workflows depend heavily on records and evidence, so documents need better handling.

Needed improvements:

- upload and attach files
- verify document type
- support version history
- store metadata for each file
- allow reviewer comments on each document
- show whether a document is verified, pending, or rejected

### 9. Audit history

Any land record system needs a clear audit trail.

Track:

- who changed the record
- what changed
- when it changed
- why it changed
- approval or rejection outcome

### 10. Search and filtering

Stakeholders should be able to find records quickly.

Filters should include:

- property ID
- owner
- village or locality
- document type
- encumbrance status
- income status
- verification status

### 11. Database integration

The system should not remain in-memory if it is meant to support real land records.

Minimum data entities:

- users
- roles
- properties
- ownership history
- encumbrances
- income records
- documents
- map locations
- review actions
- audit logs

### 12. Review and approval workflow

The asset submission for review needs to be stronger and more structured.

Missing pieces:

- submission status
- reviewer comments
- approve/reject flow
- resubmission support
- reason codes for rejection
- timestamped history

## Issues Observed In The Current Direction

- login/logout is missing
- user roles are not enforced
- admin and user panels are not clearly separated
- asset submission for review is too weak for a proper approval workflow
- database integration is not present
- map location support is missing
- document handling is not secure enough
- audit logging is incomplete
- the record model is still too mock-like for stakeholder use

## Priority Improvements

1. Add authentication and logout.
2. Separate user, reviewer, and admin panels.
3. Move records to a database.
4. Add structured ownership, encumbrance, and income tables.
5. Add optional map location capture.
6. Strengthen the asset submission and review flow.
7. Add audit history and document verification.
8. Improve search, filters, and stakeholder summaries.

## Suggested Outcome

After these changes, the product should be able to answer:

- who owns the property
- when the transfer was executed
- whether the property is encumbered
- whether the property generates income
- where the property is located
- who reviewed or changed the record

